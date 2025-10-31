<?php

namespace App\Http\Requests\Publication;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddPublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow only authenticated users to create publications
        return auth()->check();
    }

    /**
     * Define the validation rules for creating a publication.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'max:100'],
            'published_at' => ['required', 'date'],
            'status' => ['required', 'string', 'in:activo,inactivo,borrador,pendiente'],
            'image_url' => ['nullable', 'string', 'url', 'max:255'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'visibility' => ['required', 'string', 'in:public,private'],
        ];
    }

    /**
     * Define custom validation messages.
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The status must be one of: activo, inactivo, borrador, or pendiente.',
            'visibility.in' => 'The visibility must be either public or private.',
            'image_url.url' => 'The image URL must be a valid URL.',
        ];
    }
}
