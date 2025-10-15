<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            #$table->string('password')->nullable();
            $table->string('google_id')->nullable();
            $table->string('avatar')->nullable();
            $table->enum('role', ['interested', 'member', 'coordinator', 'mentor'])->default('interested');
            $table->timestamp('last_login_at')->nullable();
            $table->softDeletes(); // agrega deleted_at en lugar de un boolean
            $table->rememberToken();
            $table->timestamps();
        });

        #Could add auth with sessions y password reset tokens , but its just google auth true?

    }

    public function down(): void {
        Schema::dropIfExists('users');
    }
};
