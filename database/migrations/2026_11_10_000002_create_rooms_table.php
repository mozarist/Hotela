<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the physical room units that belong to a room type.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')
                ->constrained('room_types')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('room_number')->unique();
            $table->enum('status', ['available', 'occupied', 'cleaning', 'maintenance'])
                ->default('available');
            $table->timestamps();
        });
    }

    /**
     * Drop the physical room units table.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
