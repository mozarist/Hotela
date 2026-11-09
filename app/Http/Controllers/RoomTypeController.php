<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Inertia\Inertia;
use Inertia\Response;

class RoomTypeController extends Controller
{
    /**
     * Display the landing page with all available room types.
     *
     * @author Hotela Engineering Team
     */
    public function index(): Response
    {
        $roomTypes = RoomType::query()
            ->orderBy('price')
            ->get(['id', 'name', 'price', 'description', 'image_path']);

        return Inertia::render('welcome', [
            'roomTypes' => $roomTypes,
        ]);
    }
}
