<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoomTypeRequest;
use App\Http\Requests\Admin\UpdateRoomTypeRequest;
use App\Models\RoomType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class RoomTypeController extends Controller
{
    /**
     * Display the room type catalogue with physical room and booking counts.
     *
     * @author Hotela Engineering Team
     */
    public function index(): Response
    {
        $roomTypes = RoomType::query()
            ->withCount(['rooms', 'bookings'])
            ->withSum('bookings', 'total_payment')
            ->orderBy('price')
            ->get()
            ->map(fn (RoomType $roomType): array => [
                'id' => $roomType->id,
                'name' => $roomType->name,
                'price' => $roomType->price,
                'description' => $roomType->description,
                'image_url' => $roomType->image_url,
                'rooms_count' => (int) $roomType->rooms_count,
                'bookings_count' => (int) $roomType->bookings_count,
                'bookings_revenue' => (int) ($roomType->bookings_sum_total_payment ?? 0),
            ]);

        return Inertia::render('dashboard/room-types', [
            'roomTypes' => $roomTypes,
            'summary' => [
                'totalRoomTypes' => $roomTypes->count(),
                'totalRooms' => (int) $roomTypes->sum('rooms_count'),
                'bookedRoomTypes' => $roomTypes->where('bookings_count', '>', 0)->count(),
                'totalBookings' => (int) $roomTypes->sum('bookings_count'),
            ],
        ]);
    }

    /**
     * Store a new room type in the catalogue.
     *
     * @author Hotela Engineering Team
     */
    public function store(StoreRoomTypeRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();

            $imagePath = $request->file('image')->store('room-types', 's3');

            if ($imagePath === false) {
                throw new RuntimeException('The room type image could not be uploaded.');
            }

            RoomType::query()->create([
                'name' => $validated['name'],
                'price' => (int) $validated['price'],
                'description' => $validated['description'],
                'image_path' => $imagePath,
            ]);

            return redirect()
                ->route('dashboard.room-types.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$validated['name']} room type was added.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'The room type could not be saved. Please try again.',
                ]);
        }
    }

    /**
     * Update an existing room type in the catalogue.
     *
     * @author Hotela Engineering Team
     */
    public function update(UpdateRoomTypeRequest $request, RoomType $roomType): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $imagePath = $roomType->image_path;

            if ($request->hasFile('image')) {
                $newImagePath = $request->file('image')->store('room-types', 's3');

                if ($newImagePath !== false) {
                    Storage::disk('s3')->delete($roomType->image_path);
                    $imagePath = $newImagePath;
                }
            }

            $roomType->update([
                'name' => $validated['name'],
                'price' => (int) $validated['price'],
                'description' => $validated['description'],
                'image_path' => $imagePath,
            ]);

            return redirect()
                ->route('dashboard.room-types.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$roomType->name} room type was updated.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'The room type could not be updated. Please try again.',
                ]);
        }
    }

    /**
     * Remove a room type that has no physical rooms or bookings.
     *
     * @author Hotela Engineering Team
     */
    public function destroy(RoomType $roomType): RedirectResponse
    {
        if ($roomType->rooms()->exists() || $roomType->bookings()->exists()) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Room types with physical rooms or bookings cannot be deleted.',
            ]);
        }

        try {
            Storage::disk('s3')->delete($roomType->image_path);
            $roomType->delete();

            return redirect()
                ->route('dashboard.room-types.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => "{$roomType->name} room type was deleted.",
                ]);
        } catch (Throwable $exception) {
            report($exception);

            return back()->with('toast', [
                'type' => 'error',
                'message' => 'The room type could not be deleted. Please try again.',
            ]);
        }
    }
}
