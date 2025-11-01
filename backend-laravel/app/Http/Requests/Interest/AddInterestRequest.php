<?php

namespace App\Http\Requests\Interest;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddInterestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && ($user->getRoleAttribute() === 'mentor' || $user->getRoleAttribute() === 'coordinator');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'keyword' => ['required', 'string', 'max:40'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'keyword.required' => 'The keyword is required.',
            'keyword.max' => 'The keyword may not exceed 40 characters.',
        ];
    }
}
