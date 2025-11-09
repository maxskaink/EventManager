<?php

namespace App\Http\Requests\Certificate;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ListCertificatesByDateRangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can make this request.
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
            // Filter certificates by issue date range
            'issue_start_date' => ['required', 'date', 'before_or_equal:issue_end_date'],
            'issue_end_date' => ['required', 'date', 'after_or_equal:issue_start_date'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'issue_start_date.required' => 'The issue start date is required.',
            'issue_start_date.date' => 'The issue start date must be a valid date.',
            'issue_start_date.before_or_equal' => 'The issue start date must be before or equal to the issue end date.',

            'issue_end_date.required' => 'The issue end date is required.',
            'issue_end_date.date' => 'The issue end date must be a valid date.',
            'issue_end_date.after_or_equal' => 'The issue end date must be after or equal to the issue start date.',
        ];
    }
}
