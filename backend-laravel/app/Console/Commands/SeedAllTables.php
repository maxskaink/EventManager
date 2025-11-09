<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Certificate;
use App\Models\Interest;
use App\Models\Publication;
use App\Models\PublicationInterest;
use App\Models\Profile;
use App\Models\PublicationAccess;
use App\Models\Notification;
use App\Models\ExternalEvent;
use App\Models\User;
use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Faker\Factory as Faker;

class SeedAllTables extends Command
{
    protected $signature = 'db:seed-all {--force}';
    protected $description = 'Generate seed/test data for main tables (development only).';

    public function handle(): int
    {
        if (!app()->environment('local') && !$this->option('force')) {
            $this->error('This command only runs in local environment. Use --force to override.');
            return 1;
        }

        $faker = Faker::create();

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
                // ignore missing table
            }
        }

        Schema::enableForeignKeyConstraints();

        DB::beginTransaction();
        try {
            $this->info('Creating users...');
            $users = collect();
            for ($i = 0; $i < 8; $i++) {
                $u = User::query()->create([
                    'name' => $faker->name(),
                    'email' => $faker->unique()->safeEmail(),
                    'email_verified_at' => now(),
                    'google_id' => 'dev_' . uniqid(),
                    'avatar' => 'https://via.placeholder.com/150',
                    'role' => $faker->randomElement(['interested', 'member', 'mentor', 'coordinator']),
                ]);
                $users->push($u);
            }

            $this->info('Creating profiles...');
            foreach ($users as $user) {
                Profile::query()->firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'university' => $faker->company(),
                        'academic_program' => $faker->word(),
                        'phone' => $faker->phoneNumber()
                    ]
                );
            }

            $this->info('Creating interests...');
            $keywords = ['Data Science', 'AI', 'Web', 'Mobile', 'Security', 'Networking', 'Databases'];
            $interestModels = [];
            foreach ($keywords as $kw) {
                $interestModels[] = Interest::query()->create(['keyword' => $kw]);
            }

            $this->info('Linking profile interests...');
            $profileIds = DB::table('profiles')->pluck('user_id')->toArray();
            foreach ($profileIds as $pid) {
                $sample = $faker->randomElements(array_column($interestModels, 'id'), $faker->numberBetween(1, 3));
                foreach ($sample as $intId) {
                    DB::table('profile_interests')->insert([
                        'user_id' => $pid,
                        'interest_id' => $intId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            $this->info('Creating publications...');
            $publicationIds = [];
            foreach (range(1, 10) as $i) {
                $author = $users->random();
                $pub = Publication::query()->create([
                    'author_id' => $author->id,
                    'title' => $faker->sentence(6),
                    'content' => $faker->paragraph(4),
                    'type' => $faker->randomElement(['articulo', 'aviso', 'comunicado', 'material', 'evento']),
                    'published_at' => $faker->date(),
                    'status' => $faker->randomElement(['activo', 'inactivo', 'borrador', 'pendiente']),
                    'last_modified' => now(),
                    'image_url' => null,
                    'summary' => $faker->sentence(10),
                    'visibility' => 'public',
                ]);
                $publicationIds[] = $pub->id;
            }

            $this->info('Creating articles...');
            foreach (range(1, 8) as $i) {
                $author = $users->random();
                Article::query()->create([
                    'user_id' => $author->id,
                    'title' => $faker->sentence(5),
                    'description' => $faker->sentence(10),
                    'publication_date' => $faker->date(),
                    'authors' => $author->name,
                    'publication_url' => $faker->url(),
                ]);
            }

            $this->info('Creating events...');
            $eventIds = [];
            foreach (range(1, 6) as $i) {
                $start = $faker->dateTimeBetween('-1 month', '+2 months');
                $end = (clone $start)->modify('+' . $faker->numberBetween(1, 3) . ' hours');
                $ev = Event::query()->create([
                    'publication_id' => null,
                    'name' => $faker->sentence(4),
                    'description' => $faker->paragraph(),
                    'start_date' => $start,
                    'end_date' => $end,
                    'event_type' => $faker->randomElement(['charla', 'curso', 'convocatoria']),
                    'modality' => $faker->randomElement(['presencial', 'virtual', 'mixta']),
                    'location' => $faker->city(),
                    'status' => $faker->randomElement(['scheduled', 'cancelled', 'finished']),
                    'capacity' => $faker->numberBetween(10, 200),
                ]);
                $eventIds[] = $ev->id;
            }

            $this->info('Creating certificates...');
            foreach (range(1, 5) as $i) {
                $user = $users->random();
                Certificate::query()->create([
                    'user_id' => $user->id,
                    'name' => 'Certificate ' . $i,
                    'description' => $faker->sentence(),
                    'issue_date' => $faker->date(),
                    'document_url' => "assets/certificates/certificate_$i.pdf",
                    'comment' => null,
                    'deleted' => false,
                ]);
            }

            $this->info('Linking publications with interests...');
            foreach ($publicationIds as $pid) {
                $sample = $faker->randomElements(array_column($interestModels, 'id'), $faker->numberBetween(1, 3));
                foreach ($sample as $intId) {
                    PublicationInterest::query()->create([
                        'publication_id' => $pid,
                        'interest_id' => $intId,
                    ]);
                }
            }

            $this->info('Creating participations...');
            foreach ($eventIds as $eid) {
                $attendees = $users->random(min(3, $users->count()))->pluck('id')->toArray();
                foreach ($attendees as $uid) {
                    DB::table('participations')->insert([
                        'event_id' => $eid,
                        'user_id' => $uid,
                        'status' => $faker->randomElement(['inscrito', 'asistio', 'ausente', 'cancelado']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            $this->info('Creating publication access records...');
            foreach ($publicationIds as $pubId) {
                $viewers = (array)$faker->randomElements($profileIds, min(count($profileIds), $faker->numberBetween(1, max(1, min(4, count($profileIds))))));
                foreach ($viewers as $pid) {
                    try {
                        PublicationAccess::query()->create([
                            'profile_id' => $pid,
                            'publication_id' => $pubId,
                        ]);
                    } catch (\Throwable $e) {
                    }
                }
            }

            $this->info('Creating external events...');
            foreach (range(1, 6) as $i) {
                $organizer = $users->random();
                $start = $faker->dateTimeBetween('-2 months', '+3 months');
                $end = (clone $start)->modify('+' . $faker->numberBetween(1, 72) . ' hours');
                ExternalEvent::query()->create([
                    'user_id' => $organizer->id,
                    'name' => $faker->sentence(4),
                    'description' => $faker->paragraph(),
                    'start_date' => $start,
                    'end_date' => $end,
                    'modality' => $faker->randomElement(['presencial', 'virtual', 'mixta']),
                    'host_organization' => $faker->company(),
                    'location' => $faker->optional()->city(),
                    'participation_url' => $faker->optional()->url(),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
            return 1;
        }

        $this->info('✅ Seeding finished successfully.');
        return 0;
    }
}
