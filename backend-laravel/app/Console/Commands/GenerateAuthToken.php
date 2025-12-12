<?php

namespace App\Console\Commands;

use App\Models\{
    Article,
    Certificate,
    Event,
    ExternalEvent,
    Interest,
    Participation,
    Profile,
    Publication,
    PublicationAccess,
    User
};
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateAuthToken extends Command
{
    protected $signature = 'auth:token
        {email? : Email for the user}
        {--role=interested : Role for the user}
        {--all : Create one user per role}
        {--with-data : Generate related data (publications, articles, etc.)}';

    protected $description = 'Generate Sanctum tokens for testing with optional realistic data.';

    private $interests;

    public function handle(): int
    {
        if (!app()->environment('local')) {
            $this->error('❌ This command only works in local environment');
            return 1;
        }

        $roles = $this->getEnumValues('users', 'role');
        $this->loadOrCreateInterests();

        if ($this->option('all')) {
            return $this->generateAllRoles($roles);
        }

        return $this->generateSingleUser($roles);
    }

    private function generateAllRoles(array $roles): int
    {
        $this->info('🚀 Generating test users for all roles...');
        $this->line('');

        $users = collect();

        foreach ($roles as $role) {
            $user = $this->createUserWithData($role);
            $users->push($user);

            $token = $user->createToken('dev_token')->plainTextToken;

            $this->displayUserInfo($user, $token, $role);
        }

        if ($this->option('with-data')) {
            $this->generateInterRelatedData($users);
        }

        return 0;
    }

    private function generateSingleUser(array $roles): int
    {
        $email = $this->argument('email') ?? 'test@example.com';
        $role = $this->option('role');

        if (!in_array($role, $roles, true)) {
            $this->error("❌ Invalid role: '$role'. Must be one of: " . implode(', ', $roles));
            return 1;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user) {
            $this->warn("⚠️  User already exists. Regenerating token...");
            $user->tokens()->delete();
        } else {
            $user = $this->createUserWithData($role, $email);
        }

        $token = $user->createToken('dev_token')->plainTextToken;

        $this->info('✅ Token generated successfully:');
        $this->line('');
        $this->line($token);
        $this->line('');
        $this->info('Use this header in your API client:');
        $this->line("Authorization: Bearer $token");
        $this->line('');
        $this->displayUserDetails($user);

        return 0;
    }

    private function createUserWithData(string $role, ?string $email = null): User
    {
        $email = $email ?? $this->generateEmail($role);
        $name = $this->generateName($role);

        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => now(),
            'google_id' => 'dev_' . uniqid(),
            'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($name) . "&size=150",
            'role' => $role,
        ]);

        $this->createProfileWithInterests($user, $role);

        if ($this->option('with-data')) {
            $this->createRoleSpecificData($user, $role);
        }

        return $user;
    }

    private function createProfileWithInterests(User $user, string $role): void
    {
        $profileData = $this->generateProfileData($role);

        $profile = Profile::query()->create([
            'user_id' => $user->id,
            'university' => $profileData['university'],
            'academic_program' => $profileData['program'],
            'phone' => $profileData['phone'],
        ]);

        // Asignar intereses según el rol
        $interestCount = match($role) {
            'mentor', 'coordinator' => rand(4, 6),
            'seed', 'active-member' => rand(2, 4),
            'interested' => rand(1, 3),
            default => 2
        };

        $selectedInterests = $this->interests
            ->random(min($interestCount, $this->interests->count()))
            ->pluck('id');

        $profile->interests()->attach($selectedInterests);
    }

    private function createRoleSpecificData(User $user, string $role): void
    {
        switch ($role) {
            case 'mentor':
            case 'coordinator':
                // Crear eventos externos (organizados por mentores/coordinadores)
                ExternalEvent::factory()->count(rand(1, 2))->create([
                    'user_id' => $user->id
                ]);

                // Crear publicaciones de calidad
                $this->createPublicationsForUser($user, rand(2, 4));

                // Crear artículos académicos
                Article::factory()->count(rand(1, 3))->create([
                    'user_id' => $user->id
                ]);

                // Crear certificados
                Certificate::factory()->count(rand(2, 4))->create([
                    'user_id' => $user->id
                ]);
                break;

            case 'seed':
            case 'active-member':
                // Crear publicaciones
                $this->createPublicationsForUser($user, rand(1, 3));

                // Crear algunos artículos
                Article::factory()->count(rand(0, 2))->create([
                    'user_id' => $user->id
                ]);

                // Participar en eventos (si existen)
                $this->createEventParticipations($user, rand(2, 4));

                // Algunos certificados
                Certificate::factory()->count(rand(1, 2))->create([
                    'user_id' => $user->id
                ]);
                break;

            case 'interested':
                // Solo participaciones en eventos
                $this->createEventParticipations($user, rand(1, 2));

                // Acceder a algunas publicaciones
                $this->createPublicationAccesses($user, rand(2, 5));
                break;
        }
    }

    private function createPublicationsForUser(User $user, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $publication = Publication::factory()->create([
                'author_id' => $user->id
            ]);

            // Asignar intereses del usuario a la publicación
            $userInterests = $user->profile->interests->pluck('id');
            if ($userInterests->isNotEmpty()) {
                $pubInterests = $userInterests->random(min(rand(1, 3), $userInterests->count()));
                $publication->interests()->attach($pubInterests);
            }
        }
    }

    private function createEventParticipations(User $user, int $count): void
    {
        $events = Event::query()->inRandomOrder()->limit($count)->get();

        foreach ($events as $event) {
            Participation::factory()->create([
                'event_id' => $event->id,
                'user_id' => $user->id
            ]);
        }
    }

    private function createPublicationAccesses(User $user, int $count): void
    {
        $userInterests = $user->profile->interests->pluck('id');

        // Buscar publicaciones con intereses similares
        $publications = Publication::query()
            ->whereHas('interests', function ($query) use ($userInterests) {
                $query->whereIn('interests.id', $userInterests);
            })
            ->inRandomOrder()
            ->limit($count)
            ->get();

        foreach ($publications as $publication) {
            PublicationAccess::factory()->create([
                'profile_id' => $user->id,
                'publication_id' => $publication->id
            ]);
        }
    }

    private function generateInterRelatedData($users): void
    {
        $this->line('');
        $this->info('🔗 Generating inter-related data...');

        // Crear algunos eventos para que los usuarios participen
        $events = Event::factory()->count(3)->create();

        foreach ($events as $event) {
            $eligibleAttendees = $users->whereIn('role', ['interested', 'active-member', 'seed']);

            if ($eligibleAttendees->isEmpty()) {
                continue;
            }

            // Calcular cuántos asistentes queremos (entre 2 y 4, pero no más de los disponibles)
            $attendeeCount = min(rand(2, 4), $eligibleAttendees->count());
            $attendees = $eligibleAttendees->random($attendeeCount);

            foreach ($attendees as $attendee) {
                Participation::factory()->create([
                    'event_id' => $event->id,
                    'user_id' => $attendee->id
                ]);
            }
        }

        $this->line('  ✓ Created shared events and participations');
    }

    private function loadOrCreateInterests(): void
    {
        $this->interests = Interest::all();

        if ($this->interests->isEmpty()) {
            $keywords = [
                'Inteligencia Artificial',
                'Desarrollo Web',
                'Ciberseguridad',
                'Ciencia de Datos',
                'Redes',
                'Bases de Datos',
                'Internet de las Cosas'
            ];

            foreach ($keywords as $keyword) {
                $this->interests->push(
                    Interest::factory()->create(['keyword' => $keyword])
                );
            }
        }
    }

    private function generateEmail(string $role): string
    {
        $prefix = strtolower(str_replace([' ', '-'], '_', $role));
        return "{$prefix}_" . Str::random(6) . '@example.com';
    }

    private function generateName(string $role): string
    {
        $names = [
            'mentor' => ['Dr. Carlos Méndez', 'Dra. Ana Rodríguez', 'Prof. Luis García'],
            'coordinator' => ['María Coordinator', 'Juan Organizer', 'Sofia Leader'],
            'seed' => ['Pedro Innovator', 'Laura Creator', 'Diego Founder'],
            'active-member' => ['Andrea Member', 'Carlos Active', 'Patricia Participant'],
            'interested' => ['José Curious', 'Carmen Learner', 'Roberto Explorer'],
        ];

        $roleNames = $names[$role] ?? ['Test User'];
        return $roleNames[array_rand($roleNames)];
    }

    private function generateProfileData(string $role): array
    {
        $universities = [
            'Universidad del Cauca',
            'Universidad Nacional de Colombia',
            'Universidad de los Andes',
            'Universidad ICESI'
        ];

        $programs = [
            'Ingeniería de Sistemas',
            'Ingeniería Electrónica',
            'Ciencias de la Computación',
            'Ingeniería de Software'
        ];

        // Roles más avanzados tienen datos más completos
        $hasCompleteData = in_array($role, ['mentor', 'coordinator', 'seed', 'active-member']);

        return [
            'university' => $hasCompleteData ? $universities[array_rand($universities)] : null,
            'program' => $hasCompleteData ? $programs[array_rand($programs)] : null,
            'phone' => $hasCompleteData ? '+57 3' . rand(100000000, 199999999) : null,
        ];
    }

    private function displayUserInfo(User $user, string $token, string $role): void
    {
        $this->info("👤 Role: " . strtoupper($role));
        $this->line("   Email: {$user->email}");
        $this->line("   Name: {$user->name}");

        if ($this->option('with-data')) {
            $stats = $this->getUserStats($user);
            $this->line("   📊 Publications: {$stats['publications']}");
            $this->line("   📄 Articles: {$stats['articles']}");
            $this->line("   🎓 Events: {$stats['participations']}");
            $this->line("   🏅 Certificates: {$stats['certificates']}");
        }

        $this->line("   🔑 Token: " . $token);
        $this->line(str_repeat('-', 70));
    }

    private function displayUserDetails(User $user): void
    {
        $this->info('👤 User Details:');
        $this->line("   Name: {$user->name}");
        $this->line("   Email: {$user->email}");
        $this->line("   Role: {$user->role}");

        if ($user->profile) {
            $this->line("   University: " . ($user->profile->university ?? 'N/A'));
            $this->line("   Program: " . ($user->profile->academic_program ?? 'N/A'));
            $this->line("   Interests: " . $user->profile->interests->pluck('keyword')->implode(', '));
        }

        if ($this->option('with-data')) {
            $stats = $this->getUserStats($user);
            $this->line('');
            $this->info('📊 Generated Data:');
            $this->line("   Publications: {$stats['publications']}");
            $this->line("   Articles: {$stats['articles']}");
            $this->line("   Event Participations: {$stats['participations']}");
            $this->line("   Certificates: {$stats['certificates']}");
            $this->line("   External Events: {$stats['external_events']}");
        }
    }

    private function getUserStats(User $user): array
    {
        return [
            'publications' => Publication::where('author_id', $user->id)->count(),
            'articles' => Article::where('user_id', $user->id)->count(),
            'participations' => Participation::where('user_id', $user->id)->count(),
            'certificates' => Certificate::where('user_id', $user->id)->count(),
            'external_events' => ExternalEvent::where('user_id', $user->id)->count(),
        ];
    }

    private function getEnumValues(string $table, string $column): array
    {
        $type = DB::select("SHOW COLUMNS FROM {$table} WHERE Field = '{$column}'")[0]->Type ?? null;

        if (!$type || !str_starts_with($type, 'enum(')) {
            return [];
        }

        preg_match_all("/'([^']+)'/", $type, $matches);

        return $matches[1] ?? [];
    }
}
