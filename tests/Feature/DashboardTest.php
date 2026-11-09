<?php

use App\Models\Booking;
use App\Models\RoomType;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('customers cannot visit the admin dashboard', function () {
    $customer = User::factory()->create();
    $customer->assignRole('customer');

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('admins can see booking history and summary metrics', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $roomType = RoomType::factory()->create(['name' => 'Family', 'price' => 1200000]);

    Booking::factory()->count(2)->create([
        'room_type_id' => $roomType->id,
        'duration_days' => 4,
        'discount_amount' => 480000,
        'total_payment' => 4800000,
        'includes_breakfast' => true,
        'booking_date' => now()->addWeek()->toDateString(),
    ]);

    $response = $this->actingAs($admin)->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('summary.totalBookings', 2)
            ->where('summary.totalRevenue', 9600000)
            ->where('summary.breakfastBookings', 2)
            ->where('summary.totalNights', 8)
            ->has('bookings.data', 2)
            ->has('roomTypes', 1)
            ->where('bookings.data.0.room_type.name', 'Family')
        );
});

test('admins can delete a booking from the dashboard', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $booking = Booking::factory()->create();

    $this->actingAs($admin)
        ->delete(route('dashboard.bookings.destroy', $booking))
        ->assertRedirect(route('dashboard'));

    expect(Booking::query()->whereKey($booking->id)->exists())->toBeFalse();
});
