<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Creates the publication_accesses table to track which profiles have access to specific publications.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('publication_accesses', function (Blueprint $table) {
            $table->id('access_id');
            $table->unsignedBigInteger('profile_id');
            $table->unsignedBigInteger('publication_id');
            $table->timestamps();

            $table->unique(['profile_id', 'publication_id']); // prevent duplicate accesses
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('publication_accesses');
    }
};
