<?php

namespace App\Http\Requests\ExternalEvent;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExternalEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow only authenticated users to update external events
        return auth()->check();
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
            'modality' => ['sometimes', 'string', 'in:presencial,virtual,mixta'],
            'host_organization' => ['sometimes', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'participation_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Custom validation messages for updating an external event.
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The event name must be a valid string.',
            'name.max' => 'The event name cannot exceed 255 characters.',
            'description.string' => 'The event description must be a valid string.',
            'description.max' => 'The event description cannot exceed 1000 characters.',
            'start_date.date' => 'The start date must be a valid date.',
            'start_date.before_or_equal' => 'The start date must be before or equal to the end date.',
            'end_date.date' => 'The end date must be a valid date.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
            'modality.in' => 'The modality must be one of: presencial, virtual, or mixta.',
            'host_organization.string' => 'The host organization must be a valid string.',
            'host_organization.max' => 'The host organization cannot exceed 255 characters.',
            'location.string' => 'The location must be a valid string.',
            'location.max' => 'The location cannot exceed 255 characters.',
            'participation_url.url' => 'The participation URL must be a valid URL.',
            'participation_url.max' => 'The participation URL cannot exceed 255 characters.',
        ];
    }
}
