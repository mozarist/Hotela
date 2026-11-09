<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoomStatus;
use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomAvailabilityController extends Controller
{
    /**
     * Display the operational room grid with live availability statistics.
     *
     * @author Hotela Engineering Team
     */
    public function index(): Response
    {
        $rooms = Room::query()
            ->with('roomType')
            ->orderBy('room_number')
            ->get()
            ->map(fn (Room $room): array => [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'status' => $room->status->value,
                'room_type' => [
                    'id' => $room->roomType->id,
                    'name' => $room->roomType->name,
                ],
            ]);

        return Inertia::render('dashboard/room-availability', [
            'rooms' => $rooms,
            'roomTypes' => RoomType::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'statuses' => RoomStatus::options(),
            'summary' => [
                'total' => $rooms->count(),
                'available' => $rooms->where('status', RoomStatus::Available->value)->count(),
                'occupied' => $rooms->where('status', RoomStatus::Occupied->value)->count(),
                'cleaning' => $rooms->where('status', RoomStatus::Cleaning->value)->count(),
                'maintenance' => $rooms->where('status', RoomStatus::Maintenance->value)->count(),
            ],
        ]);
    }

    /**
     * Update the operational status of a physical room immediately.
     *
     * @author Hotela Engineering Team
     */
    public function updateStatus(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(RoomStatus::class)],
        ]);

        $room->update([
            'status' => $validated['status'],
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Room {$room->room_number} is now {$room->status->label()}.",
        ]);
    }
}
