<?php

namespace App\Http\Requests\Publication;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow only authenticated users to update publications
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
            'author_id' => ['sometimes', 'integer', 'exists:users,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', 'max:100'],
            'published_at' => ['sometimes', 'date'],
            'status' => ['sometimes', 'string', 'in:activo,inactivo,borrador,pendiente'],
            'image_url' => ['nullable', 'string', 'url', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'visibility' => ['sometimes', 'string', 'in:public,private'],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'author_id.exists' => 'The selected author does not exist.',
            'status.in' => 'The status must be one of: activo, inactivo, borrador, or pendiente.',
            'visibility.in' => 'The visibility must be either public or private.',
            'image_url.url' => 'The image URL must be a valid URL.',
        ];
    }
}
