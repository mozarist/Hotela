<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Customers
    Route::resource('dashboard/customers', CustomerController::class)->only(['index', 'store', 'update', 'destroy']);

    // Services
    Route::resource('dashboard/services', ServiceController::class)->only(['index', 'store', 'update', 'destroy']);

    // Transactions
    Route::resource('dashboard/transactions', TransactionController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
