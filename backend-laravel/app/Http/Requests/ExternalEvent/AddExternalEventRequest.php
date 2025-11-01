<?php

namespace App\Http\Requests\ExternalEvent;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddExternalEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow only authenticated users to create external events
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
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'modality' => ['required', 'string', 'in:presencial,virtual,mixta'],
            'host_organization' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'participation_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Custom validation messages for the external event request.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'The user ID is required.',
            'user_id.exists' => 'The specified user does not exist.',
            'name.required' => 'The event name is required.',
            'description.required' => 'The event description is required.',
            'start_date.required' => 'The event start date is required.',
            'start_date.before_or_equal' => 'The start date must be before or equal to the end date.',
            'end_date.required' => 'The event end date is required.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
            'modality.required' => 'The modality is required.',
            'modality.in' => 'The modality must be one of: presencial, virtual, or mixta.',
            'host_organization.required' => 'The host organization is required.',
            'participation_url.url' => 'The participation URL must be a valid URL.',
        ];
    }
}
