<?php

namespace App\Http\Requests\Publication;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class SetPublicationImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && ($user->getRoleAttribute() === 'mentor' || $user->getRoleAttribute() === 'coordinator');
    }
    public function rules(): array
    {
        return [
            'image' => 'required|file|mimes:jpeg,png,webp|max:2048', // 2MB max
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'An image is required.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, or webp.',
            'image.max' => 'The image size must not exceed 2MB.',
        ];
    }
}
