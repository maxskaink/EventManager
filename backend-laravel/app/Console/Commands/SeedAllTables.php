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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;

class SeedAllTables extends Command
{
    /**
     * Signature with configurable options.
     */
    protected $signature = 'db:seed-all
        {--force : Run even if not in local environment}
        {--publications=10 : Number of publications to generate}
        {--articles=8 : Number of articles to generate}
        {--events=6 : Number of internal events to generate}
        {--external=5 : Number of external events to generate}
        {--certificates=5 : Number of certificates to generate}';

    protected $description = 'Generate coherent seed/test data for all main tables (development only).';

    public function handle(): int
    {
        if (!app()->environment('local') && !$this->option('force')) {
            $this->error('❌ This command only runs in local environment. Use --force to override.');
            return 1;
        }

        $faker = Faker::create('es_ES');

        // Disable foreign keys to truncate safely
        Schema::disableForeignKeyConstraints();

        $tables = [
            'publication_interests',
            'publication_accesses',
            'publications',
            'profile_interests',
            'participations',
            'certificates',
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
                // Ignore if the table doesn't exist
            }
        }

        Schema::enableForeignKeyConstraints();

        DB::beginTransaction();
        try {
            $this->info('👤 Creating users with meaningful roles...');

            // Define role distribution
            $users = collect();
            $roles = [
                'interested' => 4,
                'active-member' => 4,
                'seed' => 2,
                'coordinator' => 1,
                'mentor' => 1,
            ];

            // Create users and profiles
            foreach ($roles as $role => $count) {
                $created = User::factory()->count($count)->create(['role' => $role]);
                foreach ($created as $user) {
                    Profile::factory()->for($user)->create();
                    $users->push($user);
                }
            }

            $this->info('📚 Creating thematic interests...');
            $keywords = [
                'Inteligencia Artificial',
                'Desarrollo Web',
                'Ciberseguridad',
                'Ciencia de Datos',
                'Redes',
                'Bases de Datos',
                'Internet de las Cosas'
            ];

            $interestIds = [];
            foreach ($keywords as $kw) {
                $interest = Interest::factory()->create(['keyword' => $kw]);
                $interestIds[] = $interest->id;
            }

            $this->info('🔗 Linking profiles with random interests...');
            foreach (Profile::all() as $profile) {
                $sample = (array) array_rand(array_flip($interestIds), rand(1, 3));
                foreach ($sample as $intId) {
                    DB::table('profile_interests')->insert([
                        'user_id' => $profile->user_id,
                        'interest_id' => $intId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }


            // Read counts from options
            $pubCount = (int) $this->option('publications');
            $artCount = (int) $this->option('articles');
            $eventCount = (int) $this->option('events');
            $extCount = (int) $this->option('external');
            $certCount = (int) $this->option('certificates');

            $this->info("📰 Creating {$pubCount} publications...");
            $publicationIds = [];
            for ($i = 0; $i < $pubCount; $i++) {
                $author = $users->whereIn('role', ['active-member', 'seed', 'mentor'])->random();
                $pub = Publication::factory()->create(['author_id' => $author->id]);
                $publicationIds[] = $pub->id;
            }

            $this->info("📄 Creating {$artCount} research articles...");
            for ($i = 0; $i < $artCount; $i++) {
                $author = $users->whereIn('role', ['active-member', 'seed', 'mentor'])->random();
                Article::factory()->create(['user_id' => $author->id]);
            }

            $this->info("🎓 Creating {$eventCount} internal university events...");
            $eventIds = [];
            for ($i = 0; $i < $eventCount; $i++) {
                $event = Event::factory()->create();
                $eventIds[] = $event->id;
            }

            $this->info('👥 Creating participation records...');
            foreach ($eventIds as $eventId) {
                $attendees = $users->whereIn('role', ['interested', 'active-member'])
                    ->random(rand(2, min(6, $users->count())))
                    ->pluck('id')
                    ->toArray();

                foreach ($attendees as $userId) {
                    Participation::factory()->create([
                        'event_id' => $eventId,
                        'user_id' => $userId,
                    ]);
                }
            }

            $this->info("🌍 Creating {$extCount} external academic events...");
            for ($i = 0; $i < $extCount; $i++) {
                $organizer = $users->whereIn('role', ['mentor', 'coordinator'])->random();
                ExternalEvent::factory()->create(['user_id' => $organizer->id]);
            }

            $this->info("🏅 Creating {$certCount} certificates...");
            for ($i = 0; $i < $certCount; $i++) {
                $user = $users->whereIn('role', ['active-member', 'seed', 'mentor'])->random();
                Certificate::factory()->create(['user_id' => $user->id]);
            }

            $this->info('🧩 Linking publications with interests...');
            foreach ($publicationIds as $pubId) {
                $sample = (array) array_rand(array_flip($interestIds), rand(1, 3));
                foreach ($sample as $intId) {
                    // Avoid duplicates in unique(publication_id, interest_id)
                    PublicationInterest::firstOrCreate([
                        'publication_id' => $pubId,
                        'interest_id' => $intId,
                    ]);
                }
            }

            $this->info('🔐 Creating publication access entries...');
            foreach (Publication::all() as $publication) {
                $randomProfile = Profile::inRandomOrder()->first();

                // Profile uses user_id as primary key; use getKey() to obtain the correct id
                $profileId = $randomProfile ? $randomProfile->getKey() : null;

                if ($profileId) {
                    DB::table('publication_accesses')->insert([
                        'profile_id' => $profileId,
                        'publication_id' => $publication->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    $this->warn("⚠️ Skipping publication {$publication->id} — no valid profile found.");
                }
            }


            DB::commit();

            // Quick stats
            $this->line('');
            $this->info('📊 Final dataset summary:');
            $this->line(' - Users: ' . User::count());
            $this->line(' - Profiles: ' . Profile::count());
            $this->line(' - Publications: ' . Publication::count());
            $this->line(' - Articles: ' . Article::count());
            $this->line(' - Events: ' . Event::count());
            $this->line(' - External Events: ' . ExternalEvent::count());
            $this->line(' - Certificates: ' . Certificate::count());
            $this->line(' - Interests: ' . Interest::count());
            $this->line(' - PublicationAccess: ' . PublicationAccess::count());
            $this->line('');

            $this->info('✅ Seeding finished successfully with coherent, meaningful data.');
            return 0;

        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }
    }
}
