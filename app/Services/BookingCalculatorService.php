<?php

namespace App\Services;

use App\Models\RoomType;
use InvalidArgumentException;

class BookingCalculatorService
{
    /**
     * Flat breakfast charge per booking.
     */
    public const BREAKFAST_FEE = 80000;

    /**
     * Discount rate applied to bookings longer than the minimum duration.
     */
    public const LONG_STAY_DISCOUNT_RATE = 0.10;

    /**
     * Minimum number of nights before the long-stay discount applies.
     */
    public const MIN_DISCOUNT_DURATION = 3;

    /**
     * Calculate the full booking breakdown from trusted room type data.
     *
     * @return array{
     *     price_per_night: int,
     *     subtotal: int,
     *     discount_amount: int,
     *     breakfast_fee: int,
     *     total_payment: int,
     *     includes_discount: bool
     * }
     *
     * @throws InvalidArgumentException
     */
    public function calculate(RoomType $roomType, int $durationDays, bool $includesBreakfast): array
    {
        if ($durationDays < 1) {
            throw new InvalidArgumentException('Booking duration must be at least one day.');
        }

        $pricePerNight = (int) $roomType->price;
        $subtotal = $pricePerNight * $durationDays;

        $includesDiscount = $durationDays > self::MIN_DISCOUNT_DURATION;
        $discountAmount = $includesDiscount
            ? (int) round($subtotal * self::LONG_STAY_DISCOUNT_RATE)
            : 0;

        $breakfastFee = $includesBreakfast ? self::BREAKFAST_FEE : 0;
        $totalPayment = $subtotal - $discountAmount + $breakfastFee;

        return [
            'price_per_night' => $pricePerNight,
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'breakfast_fee' => $breakfastFee,
            'total_payment' => $totalPayment,
            'includes_discount' => $includesDiscount,
        ];
    }
}
