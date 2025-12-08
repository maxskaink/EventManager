<?php
namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
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
        $articleId = $this->route('article'); // Asumiendo que la ruta tiene {article}
        $userId = $this->input('user_id') ?? auth()->id();

        return [
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'title' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('articles')
                    ->where(fn($query) => $query->where('user_id', $userId))
                    ->ignore($articleId),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'publication_date' => ['sometimes', 'date', 'before_or_equal:today'],
            'authors' => ['sometimes', 'string', 'max:500'],
            'publication_url' => ['sometimes', 'nullable', 'url', 'max:255'],
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
