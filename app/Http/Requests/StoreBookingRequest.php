<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the guest is allowed to create a booking.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules for a new booking.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'guest_name' => ['required', 'string', 'max:255', 'not_regex:/[0-9]/'],
            'gender' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'identity_number' => ['required', 'digits:16'],
            'booking_date' => ['required', 'date'],
            'duration_days' => ['required', 'numeric', 'integer', 'min:1', 'max:365'],
            'includes_breakfast' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom validation messages required by the assignment.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'identity_number.digits' => 'isian salah..data harus 16 digit',
            'identity_number.required' => 'isian salah..data harus 16 digit',
            'guest_name.not_regex' => 'nama tamu tidak boleh mengandung angka',
            'duration_days.numeric' => 'harus isi angka',
            'duration_days.integer' => 'harus isi angka',
            'duration_days.required' => 'harus isi angka',
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
            'room_type_id' => 'tipe kamar',
            'guest_name' => 'nama tamu',
            'gender' => 'jenis kelamin',
            'identity_number' => 'nomor identitas',
            'booking_date' => 'tanggal pemesanan',
            'duration_days' => 'durasi menginap',
            'includes_breakfast' => 'sarapan',
        ];
    }
}
