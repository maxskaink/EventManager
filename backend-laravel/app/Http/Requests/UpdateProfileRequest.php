<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'university' => ['nullable', 'string', 'max:255'],
            'academic_program' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9+\-\s()]*$/', 'max:20'],
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'university.string' => 'The university name must be a text value.',
            'university.max' => 'The university name may not exceed 255 characters.',

            'academic_program.string' => 'The academic program must be a text value.',
            'academic_program.max' => 'The academic program may not exceed 255 characters.',

            'phone.string' => 'The phone must be a valid text value.',
            'phone.regex' => 'The phone number contains invalid characters.',
            'phone.max' => 'The phone number may not exceed 20 characters.',
        ];
    }
}
