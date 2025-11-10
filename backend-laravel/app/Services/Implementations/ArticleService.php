<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Article;
use App\Models\User;
use App\Services\Contracts\ArticleServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ArticleService implements ArticleServiceInterface
{
    /** @var array<string> */
    private array $trustedOrganizations;

    public function __construct()
    {
        // Load trusted organizations from config
        $this->trustedOrganizations = config('trusted_publications.organizations', []);
    }

    /**
     * Create and store a new article for a user.
     *
     * @param array $data
     * @return Article
     *
     * @throws DuplicatedResourceException
     * @throws ModelNotFoundException
     * @throws InvalidArgumentException
     */
    public function addArticle(array $data): Article
    {
        // Ensure the user exists
        $user = User::query()->find($data['user_id']);
        if (!$user) {
            throw new ModelNotFoundException('The specified user does not exist.');
        }

        // Check for duplicate title within the same user
        $existingArticle = Article::query()
            ->where('user_id', $data['user_id'])
            ->where('title', $data['title'])
            ->first();

        if ($existingArticle) {
            throw new DuplicatedResourceException(
                "An article titled '{$data['title']}' already exists for this user."
            );
        }

        // ✅ Validate publication URL if provided
        if (!empty($data['publication_url'])) {
            $this->validatePublicationUrl($data['publication_url']);
        }

        // ✅ Validate publication date (cannot be in the future)
        if (!empty($data['publication_date'])) {
            $publicationDate = Carbon::parse($data['publication_date']);
            if ($publicationDate->isFuture()) {
                throw new InvalidArgumentException('The publication date cannot be in the future.');
            }
        }

        $article = new Article();
        $article->fill($data);
        $article->save();

        return $article;
    }

    /**
     * Update an existing article.
     *
     * @param int $articleId
     * @param array $data
     * @return Article
     *
     * @throws ModelNotFoundException
     * @throws DuplicatedResourceException
     * @throws InvalidArgumentException
     */
    public function updateArticle(int $articleId, array $data): Article
    {
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        // Validate new user_id if changed
        if (isset($data['user_id'])) {
            $newUser = User::query()->find($data['user_id']);
            if (!$newUser) {
                throw new ModelNotFoundException('The specified user does not exist.');
            }
        }

        // Check for duplicate title
        if (isset($data['title'])) {
            $duplicate = Article::query()
                ->where('user_id', $data['user_id'] ?? $article->user_id)
                ->where('title', $data['title'])
                ->where('id', '!=', $articleId)
                ->first();

            if ($duplicate) {
                throw new DuplicatedResourceException(
                    "An article titled '{$data['title']}' already exists for this user."
                );
            }
        }

        // ✅ Validate publication URL if updated
        if (!empty($data['publication_url'])) {
            $this->validatePublicationUrl($data['publication_url']);
        }

        // ✅ Validate publication date logic
        if (!empty($data['publication_date'])) {
            $publicationDate = Carbon::parse($data['publication_date']);
            if ($publicationDate->isFuture()) {
                throw new InvalidArgumentException('The publication date cannot be in the future.');
            }
        }

        $article->fill($data);
        $article->save();

        return $article;
    }

    /**
     * Validate that the publication URL belongs to a trusted organization
     * and that the link is accessible.
     */
    private function validatePublicationUrl(string $url): void
    {
        $domain = parse_url($url, PHP_URL_HOST);
        if (!$domain) {
            throw new InvalidArgumentException('The provided publication URL is invalid.');
        }

        // Check if the domain matches a trusted organization
        $isTrusted = collect($this->trustedOrganizations)
            ->contains(fn($trusted) => Str::endsWith($domain, $trusted));

        if (!$isTrusted) {
            throw new InvalidArgumentException(
                "The publication domain '{$domain}' is not from a trusted source."
            );
        }

        // Verify the URL is reachable
        try {
            $response = Http::timeout(5)->head($url);
            if ($response->failed()) {
                throw new InvalidArgumentException(
                    "The publication URL '{$url}' could not be reached or returned an error."
                );
            }
        } catch (\Throwable $e) {
            throw new InvalidArgumentException(
                "The publication URL '{$url}' is not accessible."
            );
        }
    }

    /**
     * Get all articles of a specific user.
     */
    public function getArticlesByUser(int $userId): Collection
    {
        return Article::query()
            ->where('user_id', $userId)
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * Get all articles in the system.
     */
    public function getAllArticles(): Collection
    {
        return Article::query()
            ->orderByDesc('publication_date')
            ->get();
    }

    /**
     * Get all articles published within a specific date range.
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return Article::query()
            ->whereBetween('publication_date', [$start, $end])
            ->orderBy('publication_date')
            ->get();
    }

    /**
     * Delete an existing article.
     */
    public function deleteArticle(int $articleId): void
    {
        $article = Article::query()->find($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        $article->delete();
    }
}
