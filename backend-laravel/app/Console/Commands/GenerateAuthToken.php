<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateAuthToken extends Command
{
    // Nuevo parámetro --all para crear un usuario por cada rol
    protected $signature = 'auth:token {email?} {--role=interested} {--all}';

    protected $description = 'Generate Sanctum tokens for testing. Use --all to create one user per role with random emails.';

    public function handle(): int
    {
        if (!app()->environment('local')) {
            $this->error('This command only works in local environment');
            return 1;
        }

        // Si se pasa --all, generamos un usuario por cada rol
        if ($this->option('all')) {
            $roles = ['mentor', 'coordinator', 'member', 'interested'];
            $this->info('Generating test users for all roles...');
            $this->line('');

            foreach ($roles as $role) {
                $email = strtolower($role) . '_' . Str::random(6) . '@example.com';

                $user = User::query()->create([
                    'name' => ucfirst($role) . ' User',
                    'email' => $email,
                    'email_verified_at' => now(),
                    'google_id' => 'dev_' . uniqid(),
                    'avatar' => 'https://via.placeholder.com/150',
                    'role' => $role,
                ]);

                $token = $user->createToken('dev_token')->plainTextToken;

                $this->info("Role: $role");
                $this->line("Email: $email");
                $this->line("Token: $token");
                $this->line("Header: Authorization: Bearer $token");
                $this->line(str_repeat('-', 50));
            }

            return 0;
        }

        // Modo normal: crear/generar token para un solo usuario
        $email = $this->argument('email') ?? 'test@example.com';
        $role = $this->option('role');

        $user = User::query()
            ->firstOrCreate(
                ['email' => $email],
                [
                    'email_verified_at' => now(),
                    'name' => 'Test User',
                    'google_id' => 'dev_' . uniqid(),
                    'avatar' => 'https://via.placeholder.com/150',
                    'role' => $role,
                ]
            );

        // Revocar tokens anteriores
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
}
