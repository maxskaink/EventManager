<?php

namespace App\Console\Commands;

use App\Models\{
    Article,
    Certificate,
    Interest,
    Publication,
    PublicationInterest,
    Profile,
    Participation,
    PublicationAccess,
    ExternalEvent,
    User,
    Event
};
use Illuminate\Console\Command;
use Illuminate\Support\Facades\{DB, Schema};

class SeedAllTables extends Command
{
    protected $signature = 'db:seed-all
        {--force : Run even if not in local environment}
        {--users=12 : Total number of users to generate}
        {--publications=10 : Number of publications to generate}
        {--articles=8 : Number of articles to generate}
        {--events=6 : Number of internal events to generate}
        {--external=5 : Number of external events to generate}
        {--certificates=5 : Number of certificates to generate}';

    protected $description = 'Generate coherent seed/test data for all main tables (development only).';

    private $users;
    private $interests;

    public function handle(): int
    {
        if (!app()->environment('local') && !$this->option('force')) {
            $this->error('❌ This command only runs in local environment. Use --force to override.');
            return 1;
        }

        $this->truncateTables();

        DB::beginTransaction();
        try {
            $this->createInterests();
            $this->createUsersWithProfiles();
            $this->createPublications();
            $this->createArticles();
            $this->createEvents();
            $this->createExternalEvents();
            $this->createCertificates();

            DB::commit();

            $this->displayStats();
            $this->info('✅ Seeding finished successfully with coherent, meaningful data.');
            return 0;

        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("❌ Error: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }

    private function truncateTables(): void
    {
        Schema::disableForeignKeyConstraints();

        $tables = [
            'publication_interests',
            'publication_accesses',
            'publications',
            'profile_interests',
            'participations',
            'certificates',
            'external_events',
            'events',
            'articles',
            'interests',
            'profiles',
            'users',
        ];

        foreach ($tables as $table) {
            try {
                DB::table($table)->truncate();
            } catch (\Throwable $e) {
                // Ignorar si la tabla no existe
            }
        }

        Schema::enableForeignKeyConstraints();
    }

    private function createInterests(): void
    {
        $this->info('📚 Creating thematic interests...');
        
        $keywords = [
            'Inteligencia Artificial',
            'Desarrollo Web',
            'Ciberseguridad',
            'Ciencia de Datos',
            'Redes',
            'Bases de Datos',
            'Internet de las Cosas',
            'Computación en la Nube',
            'Blockchain',
            'Desarrollo Móvil'
        ];

        $this->interests = collect($keywords)->map(function ($keyword) {
            return Interest::factory()->create(['keyword' => $keyword]);
        });
    }

    private function createUsersWithProfiles(): void
    {
        $this->info('👤 Creating users with meaningful roles and profiles...');

        $totalUsers = (int) $this->option('users');

        // Distribución proporcional de roles
        $roleDistribution = [
            'interested' => 0.33,      // 33%
            'active-member' => 0.33,   // 33%
            'seed' => 0.17,            // 17%
            'coordinator' => 0.08,     // 8%
            'mentor' => 0.09,          // 9%
        ];

        $this->users = collect();
        $usersCreated = 0;

        foreach ($roleDistribution as $role => $percentage) {
            $count = (int) round($totalUsers * $percentage);
            
            // Asegurar que al menos haya 1 de cada rol si hay suficientes usuarios
            if ($count === 0 && $totalUsers >= 5) {
                $count = 1;
            }

            for ($i = 0; $i < $count && $usersCreated < $totalUsers; $i++) {
                // Crear usuario
                $user = User::factory()->create(['role' => $role]);

                // SIEMPRE crear perfil asociado
                Profile::factory()->create(['user_id' => $user->id]);

                // Recargar la relación para asegurar que está disponible
                $user->load('profile');

                // Asignar intereses realistas según el rol
                $interestCount = match($role) {
                    'mentor', 'coordinator' => rand(4, 6),
                    'seed', 'active-member' => rand(2, 4),
                    'interested' => rand(1, 3),
                    default => 2
                };

                $selectedInterests = $this->interests
                    ->random(min($interestCount, $this->interests->count()));

                $user->profile->interests()->attach($selectedInterests->pluck('id'));

                $this->users->push($user);
                $usersCreated++;
            }
        }

        $this->line(" → Created {$this->users->count()} users with profiles and interests");
    }

    private function createPublications(): void
    {
        $count = (int) $this->option('publications');
        $this->info("📰 Creating {$count} publications...");

        $eligibleAuthors = $this->users->whereIn('role', ['active-member', 'seed', 'mentor', 'coordinator']);

        for ($i = 0; $i < $count; $i++) {
            $author = $eligibleAuthors->random();
            
            // Crear publicación con intereses relacionados al autor
            $publication = Publication::factory()->create([
                'author_id' => $author->id
            ]);

            // Asignar intereses que el autor también tiene (más realista)
            $authorInterests = $author->profile->interests->pluck('id');
            
            if ($authorInterests->isNotEmpty()) {
                $pubInterests = $authorInterests->random(min(rand(1, 3), $authorInterests->count()));
                $publication->interests()->attach($pubInterests);
            } else {
                // Si el autor no tiene intereses, asignar algunos aleatorios
                $pubInterests = $this->interests->random(rand(1, 2))->pluck('id');
                $publication->interests()->attach($pubInterests);
            }

            // Crear accesos realistas (usuarios interesados en temas relacionados)
            $this->createPublicationAccesses($publication);
        }
    }

    private function createPublicationAccesses(Publication $publication): void
    {
        // Obtener usuarios con intereses similares a la publicación
        $pubInterestIds = $publication->interests->pluck('id');
        
        $interestedUsers = $this->users
            ->filter(function ($user) use ($pubInterestIds) {
                return $user->profile->interests->pluck('id')
                    ->intersect($pubInterestIds)
                    ->isNotEmpty();
            });

        // Si hay usuarios interesados, seleccionar algunos aleatoriamente
        if ($interestedUsers->isNotEmpty()) {
            $accessCount = min(rand(2, 5), $interestedUsers->count());
            $selectedUsers = $interestedUsers->random($accessCount);

            foreach ($selectedUsers as $user) {
                PublicationAccess::factory()->create([
                    'profile_id' => $user->profile->user_id,
                    'publication_id' => $publication->id
                ]);
            }
        } else {
            // Si no hay usuarios con intereses similares, asignar accesos aleatorios
            $accessCount = min(rand(1, 3), $this->users->count());
            $selectedUsers = $this->users->random($accessCount);

            foreach ($selectedUsers as $user) {
                PublicationAccess::factory()->create([
                    'profile_id' => $user->profile->user_id,
                    'publication_id' => $publication->id
                ]);
            }
        }
    }

    private function createArticles(): void
    {
        $count = (int) $this->option('articles');
        $this->info("📄 Creating {$count} research articles...");

        $eligibleAuthors = $this->users->whereIn('role', ['active-member', 'seed', 'mentor']);

        if ($eligibleAuthors->isEmpty()) {
            $this->warn('⚠️  No eligible authors for articles. Skipping...');
            return;
        }

        for ($i = 0; $i < $count; $i++) {
            Article::factory()->create([
                'user_id' => $eligibleAuthors->random()->id
            ]);
        }
    }

    private function createEvents(): void
    {
        $count = (int) $this->option('events');
        $this->info("🎓 Creating {$count} internal university events...");

        for ($i = 0; $i < $count; $i++) {
            $event = Event::factory()->create();

            // Crear participaciones realistas
            $attendeeCount = rand(3, min(8, $this->users->count()));
            $attendees = $this->users
                ->whereIn('role', ['interested', 'active-member', 'seed'])
                ->random($attendeeCount);

            foreach ($attendees as $attendee) {
                Participation::factory()->create([
                    'event_id' => $event->id,
                    'user_id' => $attendee->id,
                ]);
            }
        }
    }

    private function createExternalEvents(): void
    {
        $count = (int) $this->option('external');
        $this->info("🌍 Creating {$count} external academic events...");

        $organizers = $this->users->whereIn('role', ['mentor', 'coordinator', 'seed']);

        if ($organizers->isEmpty()) {
            $this->warn('⚠️  No eligible organizers for external events. Skipping...');
            return;
        }

        for ($i = 0; $i < $count; $i++) {
            ExternalEvent::factory()->create([
                'user_id' => $organizers->random()->id
            ]);
        }
    }

    private function createCertificates(): void
    {
        $count = (int) $this->option('certificates');
        $this->info("🏅 Creating {$count} certificates...");

        $eligibleUsers = $this->users->whereIn('role', ['active-member', 'seed', 'mentor']);

        if ($eligibleUsers->isEmpty()) {
            $this->warn('⚠️  No eligible users for certificates. Skipping...');
            return;
        }

        for ($i = 0; $i < $count; $i++) {
            Certificate::factory()->create([
                'user_id' => $eligibleUsers->random()->id
            ]);
        }
    }

    private function displayStats(): void
    {
        $this->line('');
        $this->info('📊 Final dataset summary:');
        $this->table(
            ['Model', 'Count'],
            [
                ['Users', User::count()],
                ['Profiles', Profile::count()],
                ['Interests', Interest::count()],
                ['Publications', Publication::count()],
                ['Articles', Article::count()],
                ['Events', Event::count()],
                ['External Events', ExternalEvent::count()],
                ['Certificates', Certificate::count()],
                ['Participations', Participation::count()],
                ['Publication Accesses', PublicationAccess::count()],
                ['Profile Interests', DB::table('profile_interests')->count()],
                ['Publication Interests', PublicationInterest::count()],
            ]
        );
        $this->line('');
    }
}