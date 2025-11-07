<?php

namespace App\Http\Requests\Publication;

use Illuminate\Foundation\Http\FormRequest;

class AddPublicationInterestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow authenticated users to add profile interests
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * You can allow either a single interest_id or a list of interest_ids.
     */
    public function rules(): array
    {
        return [
            //  multiple interests in an array
            'interests' => ['required', 'array', 'min:1'],
            'interests.*' => ['integer', 'exists:interests,id'],
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'interests.required' => 'At least one interest must be provided.',
            'interests.array' => 'The interests field must be an array.',
            'interests.min' => 'You must provide at least one interest.',
            'interests.*.integer' => 'Each interest ID must be an integer.',
            'interests.*.exists' => 'Some provided interests do not exist.',
        ];
    }
}
