<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class AddProfileInterestsRequest extends FormRequest
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
            'interests' => ['required', 'array', 'min:1'],
            'interests.*' => ['integer', 'exists:interests,id'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->has('interests.*')) {
                return;
            }

            $ids = $this->input('interests', []);

            $existing = DB::table('interests')
                ->whereIn('id', $ids)
                ->pluck('id')
                ->toArray();

            $missing = array_values(array_diff($ids, $existing));

            if (!empty($missing)) {
                $validator->errors()->add(
                    'interests',
                    'The following interest IDs do not exist: ' . implode(', ', $missing)
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'interests.required' => 'At least one valid interest must be provided.',
            'interests.array' => 'The interests field must be an array.',
            'interests.min' => 'You must provide at least one interest.',
            'interests.*.integer' => 'Each interest ID must be an integer.',
            'interests.*.exists' => 'Some provided interests do not exist.',
        ];
    }
}
