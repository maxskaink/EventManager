<?php

namespace App\Http\Requests\Article;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
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
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'publication_date' => ['sometimes', 'date', 'before_or_equal:today'],
            'authors' => ['sometimes', 'string', 'max:500'],
            'publication_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'user_id.exists' => 'The specified user does not exist.',
            'title.max' => 'The title may not exceed 255 characters.',
            'description.max' => 'The description may not exceed 2000 characters.',
            'publication_date.before_or_equal' => 'The publication date cannot be in the future.',
            'authors.max' => 'The authors field may not exceed 500 characters.',
            'publication_url.url' => 'The publication URL must be a valid URL.',
        ];
    }
}
