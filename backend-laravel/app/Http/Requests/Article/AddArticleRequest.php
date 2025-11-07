<?php

namespace App\Http\Requests\Article;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'publication_date' => ['required', 'date', 'before_or_equal:today'],
            'authors' => ['required', 'string', 'max:500'],
            'publication_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'The user ID is required.',
            'user_id.exists' => 'The specified user does not exist.',
            'title.required' => 'The article title is required.',
            'description.max' => 'The description may not exceed 2000 characters.',
            'publication_date.required' => 'The publication date is required.',
            'publication_date.before_or_equal' => 'The publication date cannot be in the future.',
            'authors.required' => 'The authors field is required.',
            'publication_url.url' => 'The publication URL must be a valid URL.',
        ];
    }
}
