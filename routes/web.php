<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoomController as AdminRoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

Route::get('/', [RoomController::class, 'index'])->name('home');

Route::get('/booking', [BookingController::class, 'create'])->name('booking');
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{booking}/summary', [BookingController::class, 'summary'])
    ->name('bookings.summary');

Route::middleware(['auth', 'role:admin'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('dashboard/bookings/{booking}', [DashboardController::class, 'destroy'])
        ->name('dashboard.bookings.destroy');

    Route::get('dashboard/rooms', [AdminRoomController::class, 'index'])
        ->name('dashboard.rooms.index');
    Route::post('dashboard/rooms', [AdminRoomController::class, 'store'])
        ->name('dashboard.rooms.store');
    Route::put('dashboard/rooms/{room}', [AdminRoomController::class, 'update'])
        ->name('dashboard.rooms.update');
    Route::delete('dashboard/rooms/{room}', [AdminRoomController::class, 'destroy'])
        ->name('dashboard.rooms.destroy');
});

require __DIR__.'/settings.php';
