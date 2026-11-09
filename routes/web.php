<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoomAvailabilityController;
use App\Http\Controllers\Admin\RoomTypeController as AdminRoomTypeController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomTypeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RoomTypeController::class, 'index'])->name('home');

Route::get('/booking', [BookingController::class, 'create'])->name('booking');
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{booking}/summary', [BookingController::class, 'summary'])
    ->name('bookings.summary');

Route::middleware(['auth', 'role:admin'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('dashboard/bookings/{booking}', [DashboardController::class, 'destroy'])
        ->name('dashboard.bookings.destroy');

    Route::get('dashboard/room-types', [AdminRoomTypeController::class, 'index'])
        ->name('dashboard.room-types.index');
    Route::post('dashboard/room-types', [AdminRoomTypeController::class, 'store'])
        ->name('dashboard.room-types.store');
    Route::put('dashboard/room-types/{roomType}', [AdminRoomTypeController::class, 'update'])
        ->name('dashboard.room-types.update');
    Route::delete('dashboard/room-types/{roomType}', [AdminRoomTypeController::class, 'destroy'])
        ->name('dashboard.room-types.destroy');

    Route::get('dashboard/rooms', [RoomAvailabilityController::class, 'index'])
        ->name('dashboard.rooms.index');
    Route::patch('dashboard/rooms/{room}/status', [RoomAvailabilityController::class, 'updateStatus'])
        ->name('dashboard.rooms.status.update');
});

require __DIR__.'/settings.php';
