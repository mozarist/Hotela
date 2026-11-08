<?php

namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
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
            'image_path' => 'rooms/'.strtolower($name).'.jpg',
        ];
    }
}
