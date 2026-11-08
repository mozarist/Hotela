<?php

use App\Http\Controllers\Admin\DashboardController;
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
});

require __DIR__.'/settings.php';
