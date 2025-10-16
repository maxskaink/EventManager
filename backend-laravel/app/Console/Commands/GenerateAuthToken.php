<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateAuthToken extends Command
{
    // Agregamos el parámetro opcional --role
    protected $signature = 'auth:token {email?} {--role=interested}';

    protected $description = 'Generate a Sanctum token for testing';

    public function handle(): int
    {
        if (!app()->environment('local')) {
            $this->error('This command only works in local environment');
            return 1;
        }

        $email = $this->argument('email') ?? 'test@example.com';
        $role = $this->option('role'); // Obtenemos el rol

        $user = User::query()
            ->firstOrCreate(
                ['email' => $email],
                [
                    'email_verified_at' => now(),
                    'name' => 'Test User',
                    'google_id' => 'dev_' . uniqid(),
                    'avatar' => 'https://via.placeholder.com/150',
                    'role' => $role, // Asignamos el rol dinámicamente
                ]
            );

        // Revocar tokens anteriores
        $user->tokens()->delete();

        $token = $user->createToken('dev_token')->plainTextToken;

        $this->info('Token generado exitosamente:');
        $this->line('');
        $this->line($token);
        $this->line('');
        $this->line('');
        $this->info('Usa este header en Postman:');
        $this->line("Authorization: Bearer $token");

        return 0;
    }
}
