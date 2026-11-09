<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\RoomType;
use App\Services\BookingCalculatorService;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Seed realistic booking history for the admin dashboard.
     */
    public function run(): void
    {
        $calculator = app(BookingCalculatorService::class);

        $guests = [
            ['name' => 'Alya Putri', 'gender' => 'Perempuan', 'identity' => '3171012304950001', 'room' => 'Deluxe', 'days' => 4, 'breakfast' => true, 'days_ahead' => 2],
            ['name' => 'Bima Pratama', 'gender' => 'Laki-laki', 'identity' => '3171011203920002', 'room' => 'Standar', 'days' => 2, 'breakfast' => false, 'days_ahead' => 5],
            ['name' => 'Citra Lestari', 'gender' => 'Perempuan', 'identity' => '3171014508910003', 'room' => 'Family', 'days' => 5, 'breakfast' => true, 'days_ahead' => 8],
            ['name' => 'Dimas Saputra', 'gender' => 'Laki-laki', 'identity' => '3171010107890004', 'room' => 'Deluxe', 'days' => 3, 'breakfast' => false, 'days_ahead' => 11],
            ['name' => 'Elena Wijaya', 'gender' => 'Perempuan', 'identity' => '3171012209930005', 'room' => 'Standar', 'days' => 6, 'breakfast' => true, 'days_ahead' => 14],
            ['name' => 'Fajar Nugroho', 'gender' => 'Laki-laki', 'identity' => '3171011806880006', 'room' => 'Family', 'days' => 1, 'breakfast' => true, 'days_ahead' => 18],
        ];

        foreach ($guests as $guest) {
            $roomType = RoomType::query()->where('name', $guest['room'])->firstOrFail();

            $calculation = $calculator->calculate(
                roomType: $roomType,
                durationDays: $guest['days'],
                includesBreakfast: $guest['breakfast'],
            );

            Booking::query()->firstOrCreate(
                [
                    'identity_number' => $guest['identity'],
                    'booking_date' => now()->addDays($guest['days_ahead'])->toDateString(),
                ],
                [
                    'room_type_id' => $roomType->id,
                    'guest_name' => $guest['name'],
                    'gender' => $guest['gender'],
                    'duration_days' => $guest['days'],
                    'includes_breakfast' => $guest['breakfast'],
                    'discount_amount' => $calculation['discount_amount'],
                    'total_payment' => $calculation['total_payment'],
                ],
            );
        }
    }
}
