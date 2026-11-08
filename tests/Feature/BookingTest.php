<?php

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('s3');
});

test('the landing page lists rooms fetched from the database with S3 URLs', function () {
    Room::factory()->create([
        'name' => 'Standar',
        'price' => 450000,
        'description' => 'A calm room.',
        'image_path' => 'rooms/standar.jpg',
    ]);

    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('rooms', 1)
            ->where('rooms.0.name', 'Standar')
            ->where('rooms.0.price', 450000)
            ->where('rooms.0.image_url', fn ($url) => str_contains($url, 'rooms/standar.jpg'))
        );
});

test('the booking page exposes rooms and calculator constants', function () {
    Room::factory()->count(3)->create();

    $response = $this->get(route('booking', ['room' => 2]));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('booking')
            ->has('rooms', 3)
            ->where('selectedRoomId', 2)
            ->where('breakfastFee', 80000)
        );
});

test('a guest can create a booking and the server calculates the invoice', function () {
    $room = Room::factory()->create(['price' => 500000]);

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'guest_name' => 'Alya Putri',
        'gender' => 'Perempuan',
        'identity_number' => '3171012304950001',
        'booking_date' => now()->addDay()->toDateString(),
        'duration_days' => 4,
        'includes_breakfast' => true,
    ]);

    $booking = Booking::query()->firstOrFail();

    expect($booking->discount_amount)->toBe(200000)
        ->and($booking->total_payment)->toBe(1880000)
        ->and($booking->includes_breakfast)->toBeTrue();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('bookings.summary', $booking));
});

test('the identity number must contain exactly sixteen digits', function () {
    $room = Room::factory()->create();

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'guest_name' => 'Alya Putri',
        'gender' => 'Perempuan',
        'identity_number' => '12345',
        'booking_date' => now()->toDateString(),
        'duration_days' => 2,
        'includes_breakfast' => false,
    ]);

    $response->assertSessionHasErrors([
        'identity_number' => 'isian salah..data harus 16 digit',
    ]);
});

test('the duration must be numeric', function () {
    $room = Room::factory()->create();

    $response = $this->post(route('bookings.store'), [
        'room_id' => $room->id,
        'guest_name' => 'Alya Putri',
        'gender' => 'Perempuan',
        'identity_number' => '3171012304950001',
        'booking_date' => now()->toDateString(),
        'duration_days' => 'dua malam',
        'includes_breakfast' => false,
    ]);

    $response->assertSessionHasErrors([
        'duration_days' => 'harus isi angka',
    ]);
});

test('the summary page displays a confirmed booking invoice', function () {
    $room = Room::factory()->create([
        'name' => 'Deluxe',
        'price' => 750000,
        'description' => 'A spacious room.',
        'image_path' => 'rooms/deluxe.jpg',
    ]);

    $booking = Booking::factory()->create([
        'room_id' => $room->id,
        'guest_name' => 'Bima Pratama',
        'gender' => 'Laki-laki',
        'identity_number' => '3171011203920002',
        'booking_date' => now()->addDays(2)->toDateString(),
        'duration_days' => 4,
        'includes_breakfast' => true,
        'discount_amount' => 300000,
        'total_payment' => 2780000,
    ]);

    $response = $this->get(route('bookings.summary', $booking));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('bookings/summary')
            ->where('booking.guest_name', 'Bima Pratama')
            ->where('booking.room.name', 'Deluxe')
            ->where('booking.subtotal', 3000000)
            ->where('booking.discount_amount', 300000)
            ->where('booking.breakfast_fee', 80000)
            ->where('booking.total_payment', 2780000)
        );
});
