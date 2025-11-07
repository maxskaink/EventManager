<?php

namespace App\Http\Requests\Publication;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PublicationAccessRequest extends FormRequest
{
    /**
     * Authorize the user to manage publication access.
     *
     * Only mentors or coordinators can grant or revoke special access.
     */
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && in_array($user->getRoleAttribute(), ['mentor', 'coordinator'], true);
    }

    /**
     * Define the validation rules for managing publication access.
     *
     * Used by both grant and revoke actions.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // Either user_ids or roles must be present
            'user_ids' => ['required_without:roles', 'array', 'min:1'],
            'user_ids.*' => ['integer', 'exists:users,id'],

            'roles' => ['required_without:user_ids', 'array', 'min:1'],
            'roles.*' => ['string', 'in:interested,member'], //All publications are visible to mentors and coordinators
        ];
    }

    /**
     * Define custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_ids.required_without' => 'You must provide either user_ids or roles.',
            'user_ids.array' => 'The user_ids field must be an array.',
            'user_ids.min' => 'You must provide at least one user ID.',
            'user_ids.*.integer' => 'Each user ID must be an integer.',
            'user_ids.*.exists' => 'Some provided users do not exist.',

            'roles.required_without' => 'You must provide either roles or user_ids.',
            'roles.array' => 'The roles field must be an array.',
            'roles.min' => 'You must provide at least one role.',
            'roles.*.in' => 'Each role must be one of: interested, member, coordinator, or mentor.',
        ];
    }
}
