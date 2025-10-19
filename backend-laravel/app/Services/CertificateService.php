<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Certificate;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CertificateService
{
    /**
     * Create and store a new certificate for a user.
     *
     * @param array $data
     * @return Certificate
     *
     * @throws InvalidRoleException
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     */
    public function addCertificate(array $data): Certificate
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        // Ensure the authenticated user exists
        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to add a certificate.');
        }

        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Restrict actions: only the same user or a mentor can add a certificate
        if ($authUser->id !== $user->id && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to create certificates for other users.');
        }

        // Check if a certificate with the same name already exists for this user
        $existingCertificate = Certificate::query()->where('user_id', $data['user_id'])
            ->where('name', $data['name'])
            ->where('deleted', false)
            ->first();

        if ($existingCertificate) {
            throw new DuplicatedResourceException(
                "A certificate named '{$data['name']}' already exists for this user."
            );
        }

        $certificate = new Certificate();
        $certificate->fill($data);
        $certificate->save();

        return $certificate;
    }
}
