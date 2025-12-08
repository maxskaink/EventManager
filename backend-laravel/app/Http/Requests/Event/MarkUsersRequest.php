<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class MarkUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        return $user && in_array($user->role, ['mentor', 'coordinator']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'users' => ['required', 'array', 'min:1'],
            'users.*' => ['integer', 'exists:users,id'],
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
            'users.required' => 'At least one user must be provided.',
            'users.array' => 'The users field must be an array.',
            'users.min' => 'You must provide at least one user.',
            'users.*.integer' => 'Each user ID must be an integer.',
            'users.*.exists' => 'Some provided users do not exist.',
        ];
    }
}
