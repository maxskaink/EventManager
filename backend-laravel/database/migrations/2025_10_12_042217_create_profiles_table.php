<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id(); // primary key
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void {
        Schema::dropIfExists('profiles');
    }
};
