<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        // Only mentors or coordinators can create events
        return $user && in_array($user->getRoleAttribute(), ['mentor', 'coordinator']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'event_type' => ['required', 'string', 'max:255'],
            'modality' => ['required', 'string', 'in:presencial,virtual,mixta'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50', 'in:activo,inactivo,pendiente,cancelado'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Custom validation messages (optional)
     */
    public function messages(): array
    {
        return [
            'start_date.before_or_equal' => 'The start date must be before or equal to the end date.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
            'modality.in' => 'The modality must be one of: presencial, virtual, or mixta.',
            'status.in' => 'The status must be one of: activo, inactivo, pendiente, or cancelado.',
        ];
    }
}
