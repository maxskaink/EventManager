<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use App\Models\Publication;
use Illuminate\Database\Eloquent\Collection;

interface EventRepositoryInterface
{
    public function create(array $data): Event;
    public function update(int $id, array $data): Event;
    public function findById(int $id): ?Event;
    public function findByName(string $name): ?Event;
    public function findAll(): Collection;
    public function findUpcoming(): Collection;
    public function findPast(): Collection;
    public function attachPublication(int $eventId, Publication $publication): void;
}
