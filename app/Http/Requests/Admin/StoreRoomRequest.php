<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomRequest extends FormRequest
{
    /**
     * Determine if the admin is allowed to create a room.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules for a new room.
     *
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms', 'name'),
            ],
            'price' => ['required', 'integer', 'min:0'],
            'description' => ['required', 'string', 'max:2000'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * Get human readable attribute names.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'room name',
            'price' => 'price per night',
            'description' => 'description',
            'image' => 'room image',
        ];
    }
}
