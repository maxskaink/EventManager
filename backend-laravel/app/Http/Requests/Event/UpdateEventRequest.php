<?php

namespace App\Http\Requests\Event;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && ($user->getRoleAttribute() === 'mentor' || $user->getRoleAttribute() === 'coordinator');
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:1000'],
            'start_date' => ['sometimes', 'date', 'before_or_equal:end_date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'event_type' => ['sometimes', 'string', 'in:charla,curso, convocatoria'],
            'modality' => ['sometimes', 'string', 'in:presencial,virtual,mixta'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'max:50', 'in:activo,inactivo,pendiente,cancelado'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Custom validation messages.
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
