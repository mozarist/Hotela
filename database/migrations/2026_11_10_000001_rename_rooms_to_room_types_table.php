<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rename the room type catalogue and point bookings at it.
     */
    public function up(): void
    {
        Schema::rename('rooms', 'room_types');

        Schema::table('bookings', function (Blueprint $table): void {
            $table->renameColumn('room_id', 'room_type_id');
        });
    }

    /**
     * Reverse the room type rename.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table): void {
            $table->renameColumn('room_type_id', 'room_id');
        });

        Schema::rename('room_types', 'rooms');
    }
};
