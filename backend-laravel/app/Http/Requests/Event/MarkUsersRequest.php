<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class MarkUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = auth()->user();
        return $user && in_array($user->role, ['mentor', 'coordinator']);
    }

    public function rules(): array
    {
        return [
            'users' => ['required', 'array', 'min:1'],
            'users.*' => ['integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'users.required' => 'At least one user must be provided.',
            'users.array' => 'The users field must be an array.',
            'users.min' => 'You must provide at least one user.',
            'users.*.integer' => 'Each user ID must be an integer.',
            'users.*.exists' => 'Some provided users do not exist.',
        ];
    }
}
