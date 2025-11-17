<?php
namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $userId = $this->input('user_id');

        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('articles')
                    ->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'publication_date' => ['required', 'date', 'before_or_equal:today'],
            'authors' => ['required', 'string', 'max:500'],
            'publication_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'The user ID is required.',
            'user_id.exists' => 'The specified user does not exist.',
            'title.required' => 'The article title is required.',
            'title.unique' => 'The title provided already exists for this user.', 
            'description.max' => 'The description may not exceed 2000 characters.',
            'publication_date.required' => 'The publication date is required.',
            'publication_date.before_or_equal' => 'The publication date cannot be in the future.',
            'authors.required' => 'The authors field is required.',
            'authors.max' => 'The authors field may not exceed 500 characters.',
            'publication_url.url' => 'The publication URL must be a valid URL.',
        ];
    }
}
