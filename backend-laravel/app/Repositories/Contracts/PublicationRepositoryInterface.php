<?php

namespace App\Repositories\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface PublicationRepositoryInterface
{
    public function create(array $data): Publication;
    public function findById(int $id): ?Publication;
    public function update(int $id, array $data): Publication;
    public function findByTitle(string $title): ?Publication;

    public function listAll(int $perPage = 15): LengthAwarePaginator;
    public function listPublished(int $perPage = 15): LengthAwarePaginator;
    public function listDrafts(int $perPage = 15): LengthAwarePaginator;

    public function listPublishedForUser(?User $user, int $perPage = 15): LengthAwarePaginator;

    public function listFiltered(array $filters, ?User $user, int $perPage = 15): LengthAwarePaginator;

    public function getUsersWithAccess(int $publicationId): Collection;

}
