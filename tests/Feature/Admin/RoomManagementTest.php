<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    Storage::fake('s3');
});

function adminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.rooms.index'))->assertRedirect(route('login'));
});

test('customers cannot manage rooms', function () {
    $customer = User::factory()->create();
    $customer->assignRole('customer');

    $this->actingAs($customer)
        ->get(route('dashboard.rooms.index'))
        ->assertForbidden();
});

test('admins can see the room catalogue with booking counts', function () {
    $room = Room::factory()->create([
        'name' => 'Family',
        'price' => 1200000,
    ]);

    Booking::factory()->count(2)->create([
        'room_id' => $room->id,
        'total_payment' => 4800000,
    ]);

    $this->actingAs(adminUser())
        ->get(route('dashboard.rooms.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/rooms')
            ->where('summary.totalRooms', 1)
            ->where('summary.bookedRooms', 1)
            ->where('summary.totalBookings', 2)
            ->has('rooms', 1)
            ->where('rooms.0.name', 'Family')
            ->where('rooms.0.bookings_count', 2)
            ->where('rooms.0.bookings_revenue', 9600000)
        );
});

test('admins can add a room with an image', function () {
    $response = $this->actingAs(adminUser())
        ->post(route('dashboard.rooms.store'), [
            'name' => 'Suite',
            'price' => 1500000,
            'description' => 'A spacious suite with a private balcony.',
            'image' => UploadedFile::fake()->image('suite.jpg', 800, 600),
        ]);

    $response->assertRedirect(route('dashboard.rooms.index'));

    $room = Room::query()->where('name', 'Suite')->firstOrFail();

    expect($room->price)->toBe(1500000)
        ->and($room->description)->toBe('A spacious suite with a private balcony.')
        ->and($room->image_path)->toStartWith('rooms/');

    Storage::disk('s3')->assertExists($room->image_path);
});

test('room names must be unique and an image is required', function () {
    Room::factory()->create(['name' => 'Deluxe']);

    $this->actingAs(adminUser())
        ->post(route('dashboard.rooms.store'), [
            'name' => 'Deluxe',
            'price' => 750000,
            'description' => 'Duplicate room name.',
        ])
        ->assertSessionHasErrors(['name', 'image']);

    expect(Room::query()->where('name', 'Deluxe')->count())->toBe(1);
});

test('admins can update a room without replacing its image', function () {
    $room = Room::factory()->create([
        'name' => 'Deluxe',
        'price' => 750000,
        'image_path' => 'rooms/deluxe.jpg',
    ]);

    $this->actingAs(adminUser())
        ->put(route('dashboard.rooms.update', $room), [
            'name' => 'Deluxe Garden',
            'price' => 850000,
            'description' => 'Now overlooking the garden.',
        ])
        ->assertRedirect(route('dashboard.rooms.index'));

    $room->refresh();

    expect($room->name)->toBe('Deluxe Garden')
        ->and($room->price)->toBe(850000)
        ->and($room->image_path)->toBe('rooms/deluxe.jpg');
});

test('admins can replace a room image', function () {
    $room = Room::factory()->create([
        'name' => 'Deluxe',
        'image_path' => 'rooms/old-deluxe.jpg',
    ]);

    Storage::disk('s3')->put('rooms/old-deluxe.jpg', 'old image');

    $this->actingAs(adminUser())
        ->put(route('dashboard.rooms.update', $room), [
            'name' => 'Deluxe',
            'price' => 750000,
            'description' => 'A refreshed deluxe room.',
            'image' => UploadedFile::fake()->image('new-deluxe.jpg', 800, 600),
        ])
        ->assertRedirect(route('dashboard.rooms.index'));

    $room->refresh();

    expect($room->image_path)->not->toBe('rooms/old-deluxe.jpg');

    Storage::disk('s3')->assertMissing('rooms/old-deluxe.jpg');
    Storage::disk('s3')->assertExists($room->image_path);
});

test('admins can delete a room that has no bookings', function () {
    $room = Room::factory()->create();
    Storage::disk('s3')->put($room->image_path, 'room image');

    $this->actingAs(adminUser())
        ->delete(route('dashboard.rooms.destroy', $room))
        ->assertRedirect(route('dashboard.rooms.index'));

    expect(Room::query()->whereKey($room->id)->exists())->toBeFalse();
    Storage::disk('s3')->assertMissing($room->image_path);
});

test('admins cannot delete a room that still has bookings', function () {
    $room = Room::factory()->create();
    Booking::factory()->create(['room_id' => $room->id]);

    $this->actingAs(adminUser())
        ->delete(route('dashboard.rooms.destroy', $room))
        ->assertSessionHas('toast');

    expect(Room::query()->whereKey($room->id)->exists())->toBeTrue();
});
