<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add soft deletes to events table
        Schema::table('events', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add soft deletes to publications table
        Schema::table('publications', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add soft deletes to participations table
        Schema::table('participations', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove soft deletes from events table
        Schema::table('events', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from publications table
        Schema::table('publications', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        // Remove soft deletes from participations table
        Schema::table('participations', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
