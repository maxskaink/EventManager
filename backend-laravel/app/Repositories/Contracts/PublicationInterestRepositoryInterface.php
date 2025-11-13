<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface PublicationInterestRepositoryInterface
{
    public function exists(int $pubId, int $interestId): bool;
    public function create(int $pubId, int $interestId): void;
    public function getByPublication(int $pubId): Collection;
    public function getInterestIds(int $pubId): array;
}
