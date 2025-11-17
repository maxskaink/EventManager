<?php
namespace App\Http\Requests\Publication;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = auth()->user();

        return $user && ($user->getRoleAttribute() === 'mentor' || $user->getRoleAttribute() === 'coordinator');
    }

    public function rules(): array
    {
        $publicationId = $this->route('publication_id'); // Assumes route parameter is 'id'

        return [
            'title' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('publications', 'title')->ignore($publicationId),
            ],
            'content' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', 'in:articulo,aviso,comunicado,material,evento'],
            'status' => ['sometimes', 'string', 'in:activo,inactivo,borrador,pendiente'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'visibility' => ['sometimes', 'string', 'in:public,private']
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'The status must be one of: activo, inactivo, borrador, or pendiente.',
            'visibility.in' => 'The visibility must be either public or private.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, or webp.',
            'image.max' => 'The image size must not exceed 2MB.',
            'title.unique' => 'The title provided already exists.',
        ];
    }
}
