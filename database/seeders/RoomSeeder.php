<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Seed the room catalogue used by the landing page and booking form.
     */
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Standar',
                'price' => 450000,
                'description' => 'A calm, compact retreat with a queen bed, rain shower, smart TV, and complimentary Wi-Fi for a restful city stay.',
                'image_path' => 'rooms/standar.jpg',
            ],
            [
                'name' => 'Deluxe',
                'price' => 750000,
                'description' => 'A spacious room with a king bed, lounge corner, city view, premium amenities, and a curated minibar.',
                'image_path' => 'rooms/deluxe.jpg',
            ],
            [
                'name' => 'Family',
                'price' => 1200000,
                'description' => 'Two connected bedrooms, a private living area, and thoughtful family amenities for a comfortable group escape.',
                'image_path' => 'rooms/family.jpg',
            ],
        ];

        foreach ($rooms as $room) {
            Room::query()->updateOrCreate(
                ['name' => $room['name']],
                $room,
            );
        }
    }
}
