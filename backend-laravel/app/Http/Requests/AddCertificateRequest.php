<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddCertificateRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'issue_date' => ['required', 'date', 'before_or_equal:today'],
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
            'user_id.required' => 'The user ID is required.',
            'user_id.exists' => 'The specified user does not exist.',
            'name.required' => 'The certificate name is required.',
            'description.required' => 'The certificate description is required.',
            'issue_date.before_or_equal' => 'The issue date cannot be in the future.',
            'document_url.url' => 'The document URL must be a valid URL.'
        ];
    }
}
