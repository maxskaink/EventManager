<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('publication_accesses', function (Blueprint $table) {
            $table->id('access_id');
            $table->unsignedBigInteger('profile_id');
            $table->unsignedBigInteger('publication_id');
            $table->timestamps();

            $table->unique(['profile_id', 'publication_id']); // prevent duplicate accesses
        });
    }

    public function down(): void {
        Schema::dropIfExists('publication_accesses');
    }
};
