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
        'room_type_id',
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
     * Get the room type reserved by this booking.
     *
     * @return BelongsTo<RoomType, $this>
     */
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
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
