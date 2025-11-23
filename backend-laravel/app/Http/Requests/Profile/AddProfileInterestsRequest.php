<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class AddProfileInterestsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'interests' => ['required', 'array', 'min:1'],
            'interests.*' => ['integer', 'exists:interests,id'],
        ];
    }

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
