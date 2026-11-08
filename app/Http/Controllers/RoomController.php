<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display the landing page with all available room types.
     *
     * @author Hotela Engineering Team
     */
    public function index(): Response
    {
        $rooms = Room::query()
            ->orderBy('price')
            ->get(['id', 'name', 'price', 'description', 'image_path']);

        return Inertia::render('welcome', [
            'rooms' => $rooms,
        ]);
    }
}
