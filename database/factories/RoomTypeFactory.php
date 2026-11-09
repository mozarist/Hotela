<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RoomType>
 */
class RoomTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Standar',
            'Deluxe',
            'Family',
            'Executive',
            'Twin',
            'Suite',
        ]);

        return [
            'name' => $name,
            'price' => fake()->randomElement([450000, 750000, 1200000]),
            'description' => fake()->sentence(16),
            'image_path' => 'room-types/'.strtolower($name).'.jpg',
        ];
    }
}
