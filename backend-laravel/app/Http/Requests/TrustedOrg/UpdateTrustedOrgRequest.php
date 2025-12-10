<?php

namespace App\Http\Requests\TrustedOrg;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTrustedOrgRequest extends FormRequest
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

        return $user && in_array($user->getRoleAttribute(), ['mentor', 'coordinator']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'org' => ['sometimes', 'string', 'max:255'],
            'trusted_for_certificate' => ['sometimes', 'boolean'],
            'trusted_for_event' => ['sometimes', 'boolean'],
            'trusted_for_publication' => ['sometimes', 'boolean'],
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
            'org.max' => 'The organization name/domain may not exceed 255 characters.',
            'trusted_for_certificate.boolean' => 'The trusted for certificate field must be true or false.',
            'trusted_for_event.boolean' => 'The trusted for event field must be true or false.',
            'trusted_for_publication.boolean' => 'The trusted for publication field must be true or false.',
        ];
    }
}
