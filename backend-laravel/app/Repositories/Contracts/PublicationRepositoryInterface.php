<?php

namespace App\Repositories\Contracts;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface PublicationRepositoryInterface
{
    public function create(array $data): Publication;
    public function findById(int $id): ?Publication;
    public function update(int $id, array $data): Publication;
    public function findByTitle(string $title): ?Publication;

    public function listAll(): Collection;
    public function listPublished(): Collection;
    public function listDrafts(): Collection;

    public function listPublishedForUser(?User $user): Collection;
}
