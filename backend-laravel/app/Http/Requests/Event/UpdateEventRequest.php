<?php

namespace App\Http\Requests\Event;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && ($user->getRoleAttribute() === 'mentor' || $user->getRoleAttribute() === 'coordinator');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $eventId = $this->route('eventId'); // Get the event ID from the route parameter

        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('events', 'name')->ignore($eventId),
            ],
            'description' => ['sometimes', 'string', 'max:1000'],
            'start_date' => ['sometimes', 'date', 'before_or_equal:end_date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'event_type' => ['sometimes', 'string', 'in:charla,curso,convocatoria,taller,conferencia'],
            'modality' => ['sometimes', 'string', 'in:presencial,virtual,mixta'],
            'virtual_url' => ['nullable', 'url'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'max:50', 'in:activo,inactivo,pendiente,cancelado'],
            'capacity' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'An event with this name already exists.',
            'start_date.before_or_equal' => 'The start date must be before or equal to the end date.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
            'modality.in' => 'The modality must be one of: presencial, virtual, or mixta.',
            'status.in' => 'The status must be one of: activo, inactivo, pendiente, or cancelado.',
            'virtual_url.url' => 'The virtual URL must be a valid URL format.',
        ];
    }
}
