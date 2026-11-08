<?php

use App\Models\Room;
use App\Services\BookingCalculatorService;

function roomWithPrice(int $price): Room
{
    return new Room(['price' => $price]);
}

test('it calculates a booking without a discount or breakfast', function () {
    $calculator = new BookingCalculatorService;

    $result = $calculator->calculate(roomWithPrice(450000), 2, false);

    expect($result)->toMatchArray([
        'price_per_night' => 450000,
        'subtotal' => 900000,
        'discount_amount' => 0,
        'breakfast_fee' => 0,
        'total_payment' => 900000,
        'includes_discount' => false,
    ]);
});

test('it does not apply the discount for a three night stay', function () {
    $calculator = new BookingCalculatorService;

    $result = $calculator->calculate(roomWithPrice(500000), 3, false);

    expect($result['discount_amount'])->toBe(0)
        ->and($result['total_payment'])->toBe(1500000)
        ->and($result['includes_discount'])->toBeFalse();
});

test('it applies a ten percent discount for stays longer than three nights', function () {
    $calculator = new BookingCalculatorService;

    $result = $calculator->calculate(roomWithPrice(500000), 4, false);

    expect($result['subtotal'])->toBe(2000000)
        ->and($result['discount_amount'])->toBe(200000)
        ->and($result['total_payment'])->toBe(1800000)
        ->and($result['includes_discount'])->toBeTrue();
});

test('it adds the flat breakfast fee after the discount is applied', function () {
    $calculator = new BookingCalculatorService;

    $result = $calculator->calculate(roomWithPrice(500000), 4, true);

    expect($result['discount_amount'])->toBe(200000)
        ->and($result['breakfast_fee'])->toBe(80000)
        ->and($result['total_payment'])->toBe(1880000);
});

test('it rejects a duration below one night', function () {
    $calculator = new BookingCalculatorService;

    $calculator->calculate(roomWithPrice(500000), 0, false);
})->throws(InvalidArgumentException::class);
