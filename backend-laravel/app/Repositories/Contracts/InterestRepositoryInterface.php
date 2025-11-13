<?php

namespace App\Repositories\Contracts;

use App\Models\Interest;
use Illuminate\Database\Eloquent\Collection;

interface InterestRepositoryInterface
{
    public function create(array $data): Interest;
    public function findByKeyword(string $keyword): ?Interest;
    public function findAll(): Collection;
    public function findById(int $id): ?Interest;
    public function delete(int $id): void;
}
