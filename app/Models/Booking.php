<?php

namespace App\Models;

use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'room_id',
        'guest_name',
        'gender',
        'identity_number',
        'booking_date',
        'duration_days',
        'includes_breakfast',
        'discount_amount',
        'total_payment',
    ];

    /**
     * Get the room reserved by this booking.
     *
     * @return BelongsTo<Room, $this>
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'duration_days' => 'integer',
            'includes_breakfast' => 'boolean',
            'discount_amount' => 'integer',
            'total_payment' => 'integer',
        ];
    }
}
