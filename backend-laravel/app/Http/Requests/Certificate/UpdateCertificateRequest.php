<?php

namespace App\Http\Requests\Certificate;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificateRequest extends FormRequest
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
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:1000'],
            'issue_date' => ['sometimes', 'date', 'before_or_equal:today'],
            'document_url' => ['nullable', 'url', 'max:255'],
            'comment' => ['nullable', 'string', 'max:500']
        ];
    }

    /**
     * Custom validation messages (optional)
     */
    public function messages(): array
    {
        return [
            'name.string' => 'The certificate name must be a valid string.',
            'name.max' => 'The certificate name cannot exceed 255 characters.',
            'description.string' => 'The certificate description must be a valid string.',
            'description.max' => 'The certificate description cannot exceed 1000 characters.',
            'issue_date.date' => 'The issue date must be a valid date.',
            'issue_date.before_or_equal' => 'The issue date cannot be in the future.',
            'document_url.url' => 'The document URL must be a valid URL.',
            'document_url.max' => 'The document URL cannot exceed 255 characters.',
            'comment.string' => 'The comment must be a valid string.',
            'comment.max' => 'The comment cannot exceed 500 characters.'
        ];
    }
}
