<?php

use App\Enums\RoomStatus;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function availabilityAdmin(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.rooms.index'))->assertRedirect(route('login'));
});

test('customers cannot access room availability', function () {
    $customer = User::factory()->create();
    $customer->assignRole('customer');

    $this->actingAs($customer)
        ->get(route('dashboard.rooms.index'))
        ->assertForbidden();
});

test('admins can see the room grid with status statistics', function () {
    $standar = RoomType::factory()->create(['name' => 'Standar']);
    $deluxe = RoomType::factory()->create(['name' => 'Deluxe']);

    Room::factory()->create([
        'room_type_id' => $standar->id,
        'room_number' => '101',
        'status' => RoomStatus::Available,
    ]);

    Room::factory()->create([
        'room_type_id' => $standar->id,
        'room_number' => '102',
        'status' => RoomStatus::Occupied,
    ]);

    Room::factory()->create([
        'room_type_id' => $deluxe->id,
        'room_number' => '201',
        'status' => RoomStatus::Cleaning,
    ]);

    Room::factory()->create([
        'room_type_id' => $deluxe->id,
        'room_number' => '202',
        'status' => RoomStatus::Maintenance,
    ]);

    $this->actingAs(availabilityAdmin())
        ->get(route('dashboard.rooms.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/room-availability')
            ->has('rooms', 4)
            ->has('roomTypes', 2)
            ->has('statuses', 4)
            ->where('summary.total', 4)
            ->where('summary.available', 1)
            ->where('summary.occupied', 1)
            ->where('summary.cleaning', 1)
            ->where('summary.maintenance', 1)
            ->where('rooms.0.room_number', '101')
            ->where('rooms.0.status', 'available')
            ->where('rooms.0.room_type.name', 'Standar')
        );
});

test('admins can update a room status instantly', function () {
    $room = Room::factory()->create([
        'status' => RoomStatus::Cleaning,
    ]);

    $this->actingAs(availabilityAdmin())
        ->from(route('dashboard.rooms.index'))
        ->patch(route('dashboard.rooms.status.update', $room), [
            'status' => RoomStatus::Available->value,
        ])
        ->assertRedirect(route('dashboard.rooms.index'))
        ->assertSessionHas('toast');

    expect($room->refresh()->status)->toBe(RoomStatus::Available);
});

test('an invalid room status is rejected', function () {
    $room = Room::factory()->create([
        'status' => RoomStatus::Available,
    ]);

    $this->actingAs(availabilityAdmin())
        ->from(route('dashboard.rooms.index'))
        ->patch(route('dashboard.rooms.status.update', $room), [
            'status' => 'broken',
        ])
        ->assertSessionHasErrors('status');

    expect($room->refresh()->status)->toBe(RoomStatus::Available);
});
