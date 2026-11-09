<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('the database seeder creates the hotel catalogue, rooms and demo bookings', function () {
    $this->seed(DatabaseSeeder::class);

    expect(User::role('admin')->count())->toBe(1)
        ->and(RoomType::count())->toBe(3)
        ->and(RoomType::pluck('name')->sort()->values()->all())->toBe(['Deluxe', 'Family', 'Standar'])
        ->and(Room::count())->toBe(10)
        ->and(Booking::count())->toBe(6);

    expect(Booking::query()->where('includes_breakfast', true)->exists())->toBeTrue()
        ->and(Booking::query()->where('discount_amount', '>', 0)->exists())->toBeTrue();

    expect(User::query()->where('email', 'admin@hotela.test')->first()?->hasRole('admin'))->toBeTrue();
});
