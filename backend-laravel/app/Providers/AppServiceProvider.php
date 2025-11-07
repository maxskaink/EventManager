<?php

namespace App\Providers;

use App\Services\Contracts\ArticleServiceInterface;
use App\Services\Contracts\AuthServiceInterface;
use App\Services\Contracts\CertificateServiceInterface;
use App\Services\Contracts\EventServiceInterface;
use App\Services\Contracts\ExternalEventServiceInterface;
use App\Services\Contracts\InterestServiceInterface;
use App\Services\Contracts\ProfileServiceInterface;
use App\Services\Contracts\PublicationServiceInterface;
use App\Services\Contracts\UserServiceInterface;
use App\Services\Implementations\ArticleService;
use App\Services\Implementations\AuthService;
use App\Services\Implementations\CertificateService;
use App\Services\Implementations\EventService;
use App\Services\Implementations\ExternalEventService;
use App\Services\Implementations\InterestService;
use App\Services\Implementations\ProfileService;
use App\Services\Implementations\PublicationService;
use App\Services\Implementations\UserService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Article;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\ExternalEvent;
use App\Models\Publication;
use App\Models\Profile;
use App\Models\User;
use App\Policies\ArticlePolicy;
use App\Policies\CertificatePolicy;
use App\Policies\EventPolicy;
use App\Policies\ExternalEventPolicy;
use App\Policies\PublicationPolicy;
use App\Policies\ProfilePolicy;
use App\Policies\UserPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    // Bind service interfaces to implementations for dependency injection
    $this->app->bind(ArticleServiceInterface::class, ArticleService::class);
    $this->app->bind(AuthServiceInterface::class, AuthService::class);
    $this->app->bind(CertificateServiceInterface::class, CertificateService::class);
    $this->app->bind(EventServiceInterface::class, EventService::class);
    $this->app->bind(ExternalEventServiceInterface::class, ExternalEventService::class);
    $this->app->bind(InterestServiceInterface::class, InterestService::class);
    $this->app->bind(ProfileServiceInterface::class, ProfileService::class);
    $this->app->bind(PublicationServiceInterface::class, PublicationService::class);
    $this->app->bind(UserServiceInterface::class, UserService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register model policies
    Gate::policy(Article::class, ArticlePolicy::class);
    Gate::policy(Certificate::class, CertificatePolicy::class);
    Gate::policy(Event::class, EventPolicy::class);
    Gate::policy(ExternalEvent::class, ExternalEventPolicy::class);
    Gate::policy(Publication::class, PublicationPolicy::class);
    Gate::policy(Profile::class, ProfilePolicy::class);
    Gate::policy(User::class, UserPolicy::class);
        Config::set('cors.allowed_origins', ['http://localhost:5173']);
        Config::set('cors.supports_credentials', true);
    }
}
