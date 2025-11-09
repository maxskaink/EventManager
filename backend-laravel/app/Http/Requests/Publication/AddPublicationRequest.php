<?php

namespace App\Http\Requests\Publication;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddPublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && (
                $user->getRoleAttribute() === 'mentor' ||
                $user->getRoleAttribute() === 'coordinator'
            );
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
            'type' => ['required', 'string', 'in:articulo,aviso,comunicado,material,evento'],
            'published_at' => ['required', 'date'],
            'status' => ['required', 'string', 'in:activo,inactivo,borrador,pendiente'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'visibility' => ['required', 'string', 'in:public,private'],

            // 👇 Updated field: now supports real file uploads
            'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'], // max 2MB
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
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, or webp.',
            'image.max' => 'The image size must not exceed 2MB.',
        ];
    }
}
