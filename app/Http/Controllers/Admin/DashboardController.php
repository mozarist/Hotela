<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with booking history and summary metrics.
     *
     * @author Hotela Engineering Team
     */
    public function index(Request $request): Response
    {
        $search = trim($request->string('search')->toString());
        $roomTypeId = $request->integer('room_type_id');

        $bookings = Booking::query()
            ->with('roomType')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('guest_name', 'like', "%{$search}%")
                        ->orWhere('identity_number', 'like', "%{$search}%");
                });
            })
            ->when($roomTypeId > 0, fn ($query) => $query->where('room_type_id', $roomTypeId))
            ->latest('created_at')
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Booking $booking): array => [
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
                ],
            ]);

        return Inertia::render('dashboard', [
            'bookings' => $bookings,
            'roomTypes' => RoomType::query()
                ->orderBy('price')
                ->get(['id', 'name', 'price']),
            'filters' => [
                'search' => $search,
                'room_type_id' => $roomTypeId > 0 ? $roomTypeId : null,
            ],
            'summary' => [
                'totalBookings' => Booking::query()->count(),
                'totalRevenue' => (int) Booking::query()->sum('total_payment'),
                'upcomingBookings' => Booking::query()
                    ->whereDate('booking_date', '>=', now()->toDateString())
                    ->count(),
                'breakfastBookings' => Booking::query()
                    ->where('includes_breakfast', true)
                    ->count(),
                'totalNights' => (int) Booking::query()->sum('duration_days'),
            ],
        ]);
    }

    /**
     * Remove a booking from the admin booking history.
     *
     * @author Hotela Engineering Team
     */
    public function destroy(Booking $booking): RedirectResponse
    {
        try {
            $booking->delete();

            return redirect()
                ->route('dashboard')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "Booking for {$booking->guest_name} was deleted.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return redirect()
                ->route('dashboard')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'The booking could not be deleted. Please try again.',
                ]);
        }
    }
}
