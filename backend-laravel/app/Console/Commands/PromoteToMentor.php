<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteToMentor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:promote {email} {role=mentor}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to a specific role (mentor, coordinator, member, interested)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $role = $this->argument('role');

        // Validate role
        if (!in_array($role, ['interested', 'member', 'coordinator', 'mentor'])) {
            $this->error("Invalid role: {$role}. Must be one of: interested, member, coordinator, mentor");
            return Command::FAILURE;
        }

        // Find user by email
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User not found with email: {$email}");
            return Command::FAILURE;
        }

        // Update role
        $oldRole = $user->role;
        $user->role = $role;
        $user->save();

        $this->info("✓ User '{$user->name}' ({$email}) promoted from '{$oldRole}' to '{$role}'");
        return Command::SUCCESS;
    }
}

