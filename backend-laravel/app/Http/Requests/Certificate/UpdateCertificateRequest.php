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
            'name' => ['required', 'string', 'max:255'],
            'issuing_organization' => ['required', 'string', 'max:255'],
            'issue_date' => ['required', 'date', 'before_or_equal:today'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'credential_id' => ['nullable', 'string', 'max:255'],
            'credential_url' => ['nullable', 'url', 'max:255'],
            'does_not_expire' => ['boolean']
        ];
    }

    /**
     * Custom validation messages (optional)
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The certificate name is required.',
            'issuing_organization.required' => 'The issuing organization is required.',
            'issue_date.required' => 'The issue date is required.',
            'issue_date.before_or_equal' => 'The issue date cannot be in the future.',
            'expiration_date.after_or_equal' => 'The expiration date cannot be earlier than the issue date.',
            'credential_url.url' => 'The credential URL must be a valid URL.',
        ];
    }
}
