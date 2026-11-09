<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    Storage::fake('s3');
});

function roomTypeAdmin(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.room-types.index'))->assertRedirect(route('login'));
});

test('customers cannot manage room types', function () {
    $customer = User::factory()->create();
    $customer->assignRole('customer');

    $this->actingAs($customer)
        ->get(route('dashboard.room-types.index'))
        ->assertForbidden();
});

test('admins can see the room type catalogue with room and booking counts', function () {
    $roomType = RoomType::factory()->create([
        'name' => 'Family',
        'price' => 1200000,
    ]);

    Room::factory()->count(3)->create(['room_type_id' => $roomType->id]);

    Booking::factory()->count(2)->create([
        'room_type_id' => $roomType->id,
        'total_payment' => 4800000,
    ]);

    $this->actingAs(roomTypeAdmin())
        ->get(route('dashboard.room-types.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/room-types')
            ->where('summary.totalRoomTypes', 1)
            ->where('summary.totalRooms', 3)
            ->where('summary.totalBookings', 2)
            ->has('roomTypes', 1)
            ->where('roomTypes.0.name', 'Family')
            ->where('roomTypes.0.rooms_count', 3)
            ->where('roomTypes.0.bookings_count', 2)
            ->where('roomTypes.0.bookings_revenue', 9600000)
        );
});

test('admins can add a room type with an image', function () {
    $response = $this->actingAs(roomTypeAdmin())
        ->post(route('dashboard.room-types.store'), [
            'name' => 'Suite',
            'price' => 1500000,
            'description' => 'A spacious suite with a private balcony.',
            'image' => UploadedFile::fake()->image('suite.jpg', 800, 600),
        ]);

    $response->assertRedirect(route('dashboard.room-types.index'));

    $roomType = RoomType::query()->where('name', 'Suite')->firstOrFail();

    expect($roomType->price)->toBe(1500000)
        ->and($roomType->description)->toBe('A spacious suite with a private balcony.')
        ->and($roomType->image_path)->toStartWith('room-types/');

    Storage::disk('s3')->assertExists($roomType->image_path);
});

test('room type names must be unique and an image is required', function () {
    RoomType::factory()->create(['name' => 'Deluxe']);

    $this->actingAs(roomTypeAdmin())
        ->post(route('dashboard.room-types.store'), [
            'name' => 'Deluxe',
            'price' => 750000,
            'description' => 'Duplicate room type name.',
        ])
        ->assertSessionHasErrors(['name', 'image']);

    expect(RoomType::query()->where('name', 'Deluxe')->count())->toBe(1);
});

test('admins can update a room type without replacing its image', function () {
    $roomType = RoomType::factory()->create([
        'name' => 'Deluxe',
        'price' => 750000,
        'image_path' => 'room-types/deluxe.jpg',
    ]);

    $this->actingAs(roomTypeAdmin())
        ->put(route('dashboard.room-types.update', $roomType), [
            'name' => 'Deluxe Garden',
            'price' => 850000,
            'description' => 'Now overlooking the garden.',
        ])
        ->assertRedirect(route('dashboard.room-types.index'));

    $roomType->refresh();

    expect($roomType->name)->toBe('Deluxe Garden')
        ->and($roomType->price)->toBe(850000)
        ->and($roomType->image_path)->toBe('room-types/deluxe.jpg');
});

test('admins can replace a room type image', function () {
    $roomType = RoomType::factory()->create([
        'name' => 'Deluxe',
        'image_path' => 'room-types/old-deluxe.jpg',
    ]);

    Storage::disk('s3')->put('room-types/old-deluxe.jpg', 'old image');

    $this->actingAs(roomTypeAdmin())
        ->put(route('dashboard.room-types.update', $roomType), [
            'name' => 'Deluxe',
            'price' => 750000,
            'description' => 'A refreshed deluxe room type.',
            'image' => UploadedFile::fake()->image('new-deluxe.jpg', 800, 600),
        ])
        ->assertRedirect(route('dashboard.room-types.index'));

    $roomType->refresh();

    expect($roomType->image_path)->not->toBe('room-types/old-deluxe.jpg');

    Storage::disk('s3')->assertMissing('room-types/old-deluxe.jpg');
    Storage::disk('s3')->assertExists($roomType->image_path);
});

test('admins can delete a room type that has no rooms or bookings', function () {
    $roomType = RoomType::factory()->create();
    Storage::disk('s3')->put($roomType->image_path, 'room type image');

    $this->actingAs(roomTypeAdmin())
        ->delete(route('dashboard.room-types.destroy', $roomType))
        ->assertRedirect(route('dashboard.room-types.index'));

    expect(RoomType::query()->whereKey($roomType->id)->exists())->toBeFalse();
    Storage::disk('s3')->assertMissing($roomType->image_path);
});

test('admins cannot delete a room type that still has physical rooms', function () {
    $roomType = RoomType::factory()->create();
    Room::factory()->create(['room_type_id' => $roomType->id]);

    $this->actingAs(roomTypeAdmin())
        ->delete(route('dashboard.room-types.destroy', $roomType))
        ->assertSessionHas('toast');

    expect(RoomType::query()->whereKey($roomType->id)->exists())->toBeTrue();
});

test('admins cannot delete a room type that still has bookings', function () {
    $roomType = RoomType::factory()->create();
    Booking::factory()->create(['room_type_id' => $roomType->id]);

    $this->actingAs(roomTypeAdmin())
        ->delete(route('dashboard.room-types.destroy', $roomType))
        ->assertSessionHas('toast');

    expect(RoomType::query()->whereKey($roomType->id)->exists())->toBeTrue();
});
