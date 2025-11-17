<?php
namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $articleId = $this->route('article'); // Asumiendo que la ruta tiene {article}
        $userId = $this->input('user_id') ?? auth()->id();

        return [
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'title' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('articles')
                    ->where(fn ($query) => $query->where('user_id', $userId))
                    ->ignore($articleId),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'publication_date' => ['sometimes', 'date', 'before_or_equal:today'],
            'authors' => ['sometimes', 'string', 'max:500'],
            'publication_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists' => 'The specified user does not exist.',
            'title.max' => 'The title may not exceed 255 characters.',
            'title.unique' => 'The title provided already exists for this user.', // Campo específico
            'description.max' => 'The description may not exceed 2000 characters.',
            'publication_date.before_or_equal' => 'The publication date cannot be in the future.',
            'authors.max' => 'The authors field may not exceed 500 characters.',
            'publication_url.url' => 'The publication URL must be a valid URL.',
        ];
    }
}
