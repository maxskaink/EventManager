<?php

namespace App\Console\Commands;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GenerateAuthToken extends Command
{
    protected $signature = 'auth:token {email?} {--role=interested} {--all}';

    protected $description = 'Generate Sanctum tokens for testing. Use --all to create one user per role with random emails.';

    public function handle(): int
    {
        if (!app()->environment('local')) {
            $this->error('This command only works in local environment');
            return 1;
        }

        // 🔹 Obtener roles dinámicamente desde la definición del enum
        $roles = $this->getEnumValues('users', 'role');

        if ($this->option('all')) {
            $this->info('Generating test users for all roles...');
            $this->line('');

            foreach ($roles as $role) {
                $email = strtolower(str_replace(' ', '_', $role)) . '_' . Str::random(6) . '@example.com';

                $user = User::query()->create([
                    'name' => ucfirst($role) . ' User',
                    'email' => $email,
                    'email_verified_at' => now(),
                    'google_id' => 'dev_' . uniqid(),
                    'avatar' => 'https://via.placeholder.com/150',
                    'role' => $role,
                ]);

                // Crear perfil si no existe
                if (!$user->profile) {
                    Profile::query()->create([
                        'user_id' => $user->id,
                        'university' => null,
                        'academic_program' => null,
                        'phone' => null,
                    ]);
                }

                $token = $user->createToken('dev_token')->plainTextToken;

                $this->info("Role: $role");
                $this->line("Email: $email");
                $this->line("Token: $token");
                $this->line("Header: Authorization: Bearer $token");
                $this->line(str_repeat('-', 50));
            }

            return 0;
        }

        // 🔹 Generar token para un solo usuario
        $email = $this->argument('email') ?? 'test@example.com';
        $role = $this->option('role');

        if (!in_array($role, $roles, true)) {
            $this->error("Invalid role: '$role'. Must be one of: " . implode(', ', $roles));
            return 1;
        }

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'email_verified_at' => now(),
                'name' => 'Test User',
                'google_id' => 'dev_' . uniqid(),
                'avatar' => 'https://via.placeholder.com/150',
                'role' => $role,
            ]
        );

        if (!$user->profile) {
            Profile::query()->create([
                'user_id' => $user->id,
                'university' => null,
                'academic_program' => null,
                'phone' => null,
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('dev_token')->plainTextToken;

        $this->info('Token generated successfully:');
        $this->line('');
        $this->line($token);
        $this->line('');
        $this->info('Use this header in Postman:');
        $this->line("Authorization: Bearer $token");

        return 0;
    }

    /**
     * Extrae los valores posibles de un ENUM de MySQL.
     */
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
