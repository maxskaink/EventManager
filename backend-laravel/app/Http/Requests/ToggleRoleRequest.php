<?php

namespace App\Http\Requests;

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
            'user_id' => 'required|integer|exists:users,id',
            'new_role' => 'required|string|in:interested,member,coordinator,mentor',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required',
            'user_id.integer' => 'User ID must be an integer',
            'user_id.exists' => 'User not found',
            'new_role.required' => 'New role is required',
            'new_role.in' => 'Invalid role specified',
        ];
    }
}
