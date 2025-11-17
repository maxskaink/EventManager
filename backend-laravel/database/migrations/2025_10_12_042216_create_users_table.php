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
            $table->enum('role', ['interested','active-member', 'seed', 'coordinator', 'mentor'])->default('interested');
            $table->timestamp('last_login_at')->nullable();
            $table->softDeletes();
            $table->rememberToken();
            $table->timestamps();
        });

        #Could add auth with  password reset tokens , but its just google auth true?
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
    }
};
