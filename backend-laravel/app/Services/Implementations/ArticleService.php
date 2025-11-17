<?php

namespace App\Services\Implementations;

use App\Exceptions\DuplicatedResourceException;
use App\Models\Article;
use App\Models\User;
use App\Repositories\Contracts\ArticleRepositoryInterface;
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

    protected ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
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
        $existingArticle = $this->articleRepository
            ->findByUserId($data['user_id'])
            ->firstWhere('title', $data['title']);

        if ($existingArticle) {
            throw new DuplicatedResourceException(
                "An article titled '{$data['title']}' already exists for this user."
            );
        }

        // Validate publication URL if provided
        if (!empty($data['publication_url'])) {
            $this->validatePublicationUrl($data['publication_url']);
        }

        // Validate publication date
        if (!empty($data['publication_date'])) {
            $publicationDate = Carbon::parse($data['publication_date']);
            if ($publicationDate->isFuture()) {
                throw new InvalidArgumentException('The publication date cannot be in the future.');
            }
        }

        // Create the article
        return $this->articleRepository->create($data);
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
        $article = $this->articleRepository->findById($articleId);
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
            $duplicate = $this->articleRepository
                ->findByUserId($data['user_id'] ?? $article->user_id)
                ->firstWhere('title', $data['title']);

            if ($duplicate && $duplicate->id !== $articleId) {
                throw new DuplicatedResourceException(
                    "An article titled '{$data['title']}' already exists for this user."
                );
            }
        }

        // Validate publication URL if updated
        if (!empty($data['publication_url'])) {
            $this->validatePublicationUrl($data['publication_url']);
        }

        // Validate publication date
        if (!empty($data['publication_date'])) {
            $publicationDate = Carbon::parse($data['publication_date']);
            if ($publicationDate->isFuture()) {
                throw new InvalidArgumentException('The publication date cannot be in the future.');
            }
        }

        return $this->articleRepository->update($articleId, $data);
    }

    /**
     * Validate that the publication URL belongs to a trusted organization
     * and that the link is accessible.
     *
     * @param string $url
     * @throws InvalidArgumentException
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
     *
     * @param int $userId
     * @return Collection<int, Article>
     */
    public function getArticlesByUser(int $userId): Collection
    {
        return $this->articleRepository->findByUserId($userId);
    }

    /**
     * Get all articles in the system.
     *
     * @return Collection<int, Article>
     */
    public function getAllArticles(): Collection
    {
        return $this->articleRepository->findAll();
    }

    /**
     * Get all articles published within a specific date range.
     *
     * @param string $startDate
     * @param string $endDate
     * @return Collection<int, Article>
     *
     * @throws InvalidArgumentException
     */
    public function getArticlesByDateRange(string $startDate, string $endDate): Collection
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($end->isBefore($start)) {
            throw new InvalidArgumentException('The end date cannot be earlier than the start date.');
        }

        return $this->articleRepository->findByDateRange($start->toDateString(), $end->toDateString());
    }

    /**
     * Delete an existing article.
     *
     * @param int $articleId
     * @throws ModelNotFoundException
     */
    public function deleteArticle(int $articleId): void
    {
        $article = $this->articleRepository->findById($articleId);
        if (!$article) {
            throw new ModelNotFoundException('The specified article does not exist.');
        }

        $this->articleRepository->delete($articleId);
    }

    /**
     * Get all trusted organizations.
     *
     * @return array<int, string>
     */
    public function getAllTrustedOrganizations(): array
    {
        return $this->trustedOrganizations;
    }
}
