<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

// MODELS
use App\Models\{
    Article,
    Certificate,
    Event,
    ExternalEvent,
    Publication,
    Profile,
    User,
    Notification
};

// POLICIES
use App\Policies\{
    ArticlePolicy,
    CertificatePolicy,
    EventPolicy,
    ExternalEventPolicy,
    PublicationPolicy,
    ProfilePolicy,
    UserPolicy,
    NotificationPolicy
};

// SERVICES
use App\Services\Contracts\{
    ArticleServiceInterface,
    AuthServiceInterface,
    CertificateServiceInterface,
    EventServiceInterface,
    ExternalEventServiceInterface,
    InterestServiceInterface,
    NotificationServiceInterface,
    ProfileServiceInterface,
    PublicationServiceInterface,
    UserServiceInterface
};
use App\Services\Implementations\{
    ArticleService,
    AuthService,
    CertificateService,
    EventService,
    ExternalEventService,
    InterestService,
    NotificationService,
    ProfileService,
    PublicationService,
    UserService
};

// REPOSITORIES
use App\Repositories\Contracts\{ArticleRepositoryInterface,
    AuthRepositoryInterface,
    CertificateRepositoryInterface,
    EventRepositoryInterface,
    ExternalEventRepositoryInterface,
    InterestRepositoryInterface,
    NotificationRepositoryInterface,
    ParticipationRepositoryInterface,
    ProfileRepositoryInterface,
    PublicationRepositoryInterface,
    PublicationInterestRepositoryInterface,
    PublicationAccessRepositoryInterface,
    UserRepositoryInterface};
use App\Repositories\Implementations\{ArticleRepository,
    AuthRepository,
    CertificateRepository,
    EventRepository,
    ExternalEventRepository,
    InterestRepository,
    NotificationRepository,
    ParticipationRepository,
    ProfileRepository,
    PublicationRepository,
    PublicationInterestRepository,
    PublicationAccessRepository,
    UserRepository};

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        /**
         * SERVICES
         */
        $this->app->bind(ArticleServiceInterface::class, ArticleService::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(CertificateServiceInterface::class, CertificateService::class);
        $this->app->bind(EventServiceInterface::class, EventService::class);
        $this->app->bind(ExternalEventServiceInterface::class, ExternalEventService::class);
        $this->app->bind(InterestServiceInterface::class, InterestService::class);
        $this->app->bind(ProfileServiceInterface::class, ProfileService::class);
        $this->app->bind(PublicationServiceInterface::class, PublicationService::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(NotificationServiceInterface::class, NotificationService::class);

        /**
         * REPOSITORIES
         */
        $this->app->bind(ArticleRepositoryInterface::class, ArticleRepository::class);
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(CertificateRepositoryInterface::class, CertificateRepository::class);
        $this->app->bind(EventRepositoryInterface::class, EventRepository::class);
        $this->app->bind(ExternalEventRepositoryInterface::class, ExternalEventRepository::class);
        $this->app->bind(InterestRepositoryInterface::class, InterestRepository::class);
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(ParticipationRepositoryInterface::class, ParticipationRepository::class);
        $this->app->bind(ProfileRepositoryInterface::class, ProfileRepository::class);
        $this->app->bind(PublicationRepositoryInterface::class, PublicationRepository::class);
        $this->app->bind(PublicationInterestRepositoryInterface::class, PublicationInterestRepository::class);
        $this->app->bind(PublicationAccessRepositoryInterface::class, PublicationAccessRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);


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
        Gate::policy(Notification::class, NotificationPolicy::class);

        // CORS override
        Config::set('cors.allowed_origins', ['http://localhost:5173']);
        Config::set('cors.supports_credentials', true);
    }
}
