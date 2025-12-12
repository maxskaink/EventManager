<?php

namespace App\Http\Requests\Certificate;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'issuing_organization' => ['nullable', 'string', 'max:255'],
            'issue_date' => ['nullable', 'date', 'before_or_equal:today'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'credential_id' => ['nullable', 'string', 'max:255'],
            'credential_url' => ['nullable', 'url', 'max:255'],
            'does_not_expire' => ['boolean']
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
            'name.required' => 'The certificate name is required.',
            'issuing_organization.required' => 'The issuing organization is required.',
            'issue_date.required' => 'The issue date is required.',
            'issue_date.before_or_equal' => 'The issue date cannot be in the future.',
            'expiration_date.after_or_equal' => 'The expiration date cannot be earlier than the issue date.',
            'credential_url.url' => 'The credential URL must be a valid URL.',
        ];
    }
}
