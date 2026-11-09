<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoomRequest;
use App\Http\Requests\Admin\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class RoomController extends Controller
{
    /**
     * Display the room management table with booking counts.
     *
     * @author Hotela Engineering Team
     */
    public function index(): Response
    {
        $rooms = Room::query()
            ->withCount('bookings')
            ->withSum('bookings', 'total_payment')
            ->orderBy('price')
            ->get()
            ->map(fn (Room $room): array => [
                'id' => $room->id,
                'name' => $room->name,
                'price' => $room->price,
                'description' => $room->description,
                'image_url' => $room->image_url,
                'bookings_count' => (int) $room->bookings_count,
                'bookings_revenue' => (int) ($room->bookings_sum_total_payment ?? 0),
            ]);

        return Inertia::render('dashboard/rooms', [
            'rooms' => $rooms,
            'summary' => [
                'totalRooms' => $rooms->count(),
                'bookedRooms' => $rooms->where('bookings_count', '>', 0)->count(),
                'totalBookings' => (int) $rooms->sum('bookings_count'),
            ],
        ]);
    }

    /**
     * Store a new room in the catalogue.
     *
     * @author Hotela Engineering Team
     */
    public function store(StoreRoomRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $imagePath = $request->file('image')->store('rooms', 's3');

            if ($imagePath === false) {
                throw new RuntimeException('The room image could not be uploaded.');
            }

            Room::query()->create([
                'name' => $validated['name'],
                'price' => (int) $validated['price'],
                'description' => $validated['description'],
                'image_path' => $imagePath,
            ]);

            return redirect()
                ->route('dashboard.rooms.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$validated['name']} room was added.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'The room could not be saved. Please try again.',
                ]);
        }
    }

    /**
     * Update an existing room in the catalogue.
     *
     * @author Hotela Engineering Team
     */
    public function update(UpdateRoomRequest $request, Room $room): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $imagePath = $room->image_path;

            if ($request->hasFile('image')) {
                $newImagePath = $request->file('image')->store('rooms', 's3');

                if ($newImagePath !== false) {
                    Storage::disk('s3')->delete($room->image_path);
                    $imagePath = $newImagePath;
                }
            }

            $room->update([
                'name' => $validated['name'],
                'price' => (int) $validated['price'],
                'description' => $validated['description'],
                'image_path' => $imagePath,
            ]);

            return redirect()
                ->route('dashboard.rooms.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$room->name} room was updated.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'The room could not be updated. Please try again.',
                ]);
        }
    }

    /**
     * Remove a room from the catalogue when it has no bookings.
     *
     * @author Hotela Engineering Team
     */
    public function destroy(Room $room): RedirectResponse
    {
        if ($room->bookings()->exists()) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Rooms with existing bookings cannot be deleted.',
            ]);
        }

        try {
            Storage::disk('s3')->delete($room->image_path);
            $room->delete();

            return redirect()
                ->route('dashboard.rooms.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$room->name} room was deleted.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()->with('toast', [
                'type' => 'error',
                'message' => 'The room could not be deleted. Please try again.',
            ]);
        }
    }
}
