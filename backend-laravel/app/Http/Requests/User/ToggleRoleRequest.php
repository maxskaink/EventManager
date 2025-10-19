<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class ToggleRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && $user->getRoleAttribute() === 'mentor';
    }

    public function rules(): array
    {
        return [
            'new_role' => 'required|string|in:interested,member,coordinator,mentor',
        ];
    }

    public function messages(): array
    {
        return [
            'new_role.required' => 'New role is required',
            'new_role.in' => 'Invalid role specified',
        ];
    }
}
