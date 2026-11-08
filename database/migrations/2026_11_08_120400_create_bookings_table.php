<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('guest_name');
            $table->string('gender');
            $table->string('identity_number', 16)->index();
            $table->date('booking_date');
            $table->unsignedInteger('duration_days');
            $table->boolean('includes_breakfast')->default(false);
            $table->unsignedInteger('discount_amount')->default(0);
            $table->unsignedInteger('total_payment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
