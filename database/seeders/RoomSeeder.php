<?php

namespace Database\Seeders;

use App\Enums\RoomStatus;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Seed the physical room units for every room type.
     */
    public function run(): void
    {
        $units = [
            'Standar' => ['101', '102', '103', '104'],
            'Deluxe' => ['201', '202', '203', '204'],
            'Family' => ['301', '302'],
        ];

        $statuses = RoomStatus::cases();

        foreach ($units as $roomTypeName => $roomNumbers) {
            $roomType = RoomType::query()
                ->where('name', $roomTypeName)
                ->firstOrFail();

            foreach ($roomNumbers as $index => $roomNumber) {
                Room::query()->updateOrCreate(
                    ['room_number' => $roomNumber],
                    [
                        'room_type_id' => $roomType->id,
                        'status' => $statuses[$index % count($statuses)],
                    ],
                );
            }
        }
    }
}
