<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $duration = fake()->numberBetween(1, 7);
        $pricePerNight = 450000;
        $subtotal = $pricePerNight * $duration;
        $discountAmount = $duration > 3 ? (int) round($subtotal * 0.10) : 0;
        $includesBreakfast = fake()->boolean();
        $breakfastFee = $includesBreakfast ? 80000 : 0;

        return [
            'room_id' => Room::factory(),
            'guest_name' => fake()->name(),
            'gender' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'identity_number' => fake()->numerify('################'),
            'booking_date' => fake()->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'duration_days' => $duration,
            'includes_breakfast' => $includesBreakfast,
            'discount_amount' => $discountAmount,
            'total_payment' => $subtotal - $discountAmount + $breakfastFee,
        ];
    }
}
