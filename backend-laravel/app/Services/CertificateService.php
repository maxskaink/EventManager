<?php

namespace App\Services;

use App\Exceptions\DuplicatedResourceException;
use App\Exceptions\InvalidRoleException;
use App\Models\Certificate;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;

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

    /**
     * Get all certificates of the currently authenticated user.
     *
     * @return Collection<int, Certificate>
     *
     * @throws InvalidRoleException
     */
    public function getCertificatesOfActiveUser(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view your certificates.');
        }

        return Certificate::query()->where('user_id', $authUser->id)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates of a specific user.
     *
     * @param int $userId
     * @return Collection<int, Certificate>
     *
     * @throws InvalidRoleException
     * @throws ModelNotFoundException
     */
    public function getCertificatesByUser(int $userId): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser) {
            throw new InvalidRoleException('You must be logged in to view user certificates.');
        }

        $user = User::query()->find($userId);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Allow viewing only your own certificates or if you're a mentor
        if ($authUser->id !== $userId && $authUser->role !== 'mentor') {
            throw new InvalidRoleException('You are not allowed to view certificates of other users.');
        }

        return Certificate::query()->where('user_id', $userId)
            ->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates in the system (only mentors can access this).
     *
     * @return Collection<int, Certificate>
     *
     * @throws InvalidRoleException
     */
    public function getAllCertificates(): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can view all certificates.');
        }

        return Certificate::query()->where('deleted', false)
            ->orderByDesc('issue_date')
            ->get();
    }

    /**
     * Get all certificates issued within a specific date range.
     *
     * @param string $startDate  (format: Y-m-d)
     * @param string $endDate    (format: Y-m-d)
     * @return Collection<int, Certificate>
     *
     * @throws InvalidRoleException
     * @throws InvalidArgumentException
     */
    public function getCertificatesByDateRange(string $startDate, string $endDate): Collection
    {
        /** @var User|null $authUser */
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'mentor') {
            throw new InvalidRoleException('Only mentors can filter certificates by date range.');
        }

        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return Certificate::query()->whereBetween('issue_date', [$start, $end])
            ->where('deleted', false)
            ->orderBy('issue_date')
            ->get();
    }
}
