<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\RoomType;
use App\Services\BookingCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BookingController extends Controller
{
    /**
     * Display the smart booking form with available room types.
     *
     * @author Hotela Engineering Team
     */
    public function create(Request $request): Response
    {
        $roomTypes = RoomType::query()
            ->orderBy('price')
            ->get(['id', 'name', 'price', 'description', 'image_path']);

        $selectedRoomTypeId = $request->integer('room_type');

        return Inertia::render('booking', [
            'roomTypes' => $roomTypes,
            'selectedRoomTypeId' => $selectedRoomTypeId > 0 ? $selectedRoomTypeId : null,
            'breakfastFee' => BookingCalculatorService::BREAKFAST_FEE,
            'discountRate' => BookingCalculatorService::LONG_STAY_DISCOUNT_RATE,
            'minDiscountDuration' => BookingCalculatorService::MIN_DISCOUNT_DURATION,
        ]);
    }

    /**
     * Validate the request, calculate the invoice server-side and persist it.
     *
     * @author Hotela Engineering Team
     */
    public function store(
        StoreBookingRequest $request,
        BookingCalculatorService $calculator,
    ): RedirectResponse {
        try {
            $validated = $request->validated();
            $roomType = RoomType::query()->findOrFail($validated['room_type_id']);

            $calculation = $calculator->calculate(
                roomType: $roomType,
                durationDays: (int) $validated['duration_days'],
                includesBreakfast: $request->boolean('includes_breakfast'),
            );

            $booking = Booking::query()->create([
                'room_type_id' => $roomType->id,
                'guest_name' => $validated['guest_name'],
                'gender' => $validated['gender'],
                'identity_number' => $validated['identity_number'],
                'booking_date' => $validated['booking_date'],
                'duration_days' => (int) $validated['duration_days'],
                'includes_breakfast' => $request->boolean('includes_breakfast'),
                'discount_amount' => $calculation['discount_amount'],
                'total_payment' => $calculation['total_payment'],
            ]);

            return redirect()
                ->route('bookings.summary', $booking)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Booking confirmed. Your invoice is ready.',
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'We could not save your booking. Please try again.',
                ]);
        }
    }

    /**
     * Display the invoice for a confirmed booking.
     *
     * @author Hotela Engineering Team
     */
    public function summary(Booking $booking, BookingCalculatorService $calculator): Response
    {
        $booking->loadMissing('roomType');

        $calculation = $calculator->calculate(
            roomType: $booking->roomType,
            durationDays: $booking->duration_days,
            includesBreakfast: $booking->includes_breakfast,
        );

        return Inertia::render('bookings/summary', [
            'booking' => [
                'id' => $booking->id,
                'guest_name' => $booking->guest_name,
                'gender' => $booking->gender,
                'identity_number' => $booking->identity_number,
                'booking_date' => $booking->booking_date->toDateString(),
                'duration_days' => $booking->duration_days,
                'includes_breakfast' => $booking->includes_breakfast,
                'discount_amount' => $booking->discount_amount,
                'total_payment' => $booking->total_payment,
                'created_at' => $booking->created_at?->toIso8601String(),
                'room_type' => [
                    'id' => $booking->roomType->id,
                    'name' => $booking->roomType->name,
                    'price' => $booking->roomType->price,
                    'description' => $booking->roomType->description,
                    'image_url' => $booking->roomType->image_url,
                ],
                'subtotal' => $calculation['subtotal'],
                'breakfast_fee' => $calculation['breakfast_fee'],
            ],
        ]);
    }
}
