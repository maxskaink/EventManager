<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Certificate → User
        Schema::table('certificates', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Interest → Profile
        Schema::table('interests', function (Blueprint $table) {
            $table->foreign('user_id')->references('user_id')->on('profiles')->onDelete('cascade');
        });

        // Participation → User
        Schema::table('participations', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Participation → Event
        Schema::table('participations', function (Blueprint $table) {
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });

        // InterestPublication → Publication
        Schema::table('publication_interests', function (Blueprint $table) {
            $table->foreign('publication_id')->references('id')->on('publications')->onDelete('cascade');
        });

        // Publication → Profile (author_id)
        Schema::table('publications', function (Blueprint $table) {
            $table->foreign('author_id')->references('user_id')->on('profiles')->onDelete('cascade');
        });

        // AccessPublication → Publication
        Schema::table('publication_accesses', function (Blueprint $table) {
            $table->foreign('publication_id')->references('id')->on('publications')->onDelete('cascade');
        });

        // AccessPublication → Profile
        Schema::table('publication_accesses', function (Blueprint $table) {
            $table->foreign('profile_id')->references('user_id')->on('profiles')->onDelete('cascade');
        });

        // Article → User
        Schema::table('articles', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Notification → Profile
        Schema::table('notifications', function (Blueprint $table) {
            $table->foreign('profile_id')->references('user_id')->on('profiles')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Drop foreign keys in reverse order
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('publication_accesses', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropForeign(['publication_id']);
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->dropForeign(['author_id']);
        });

        Schema::table('interest_publications', function (Blueprint $table) {
            $table->dropForeign(['publication_id']);
        });

        Schema::table('participations', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
            $table->dropForeign(['user_id']);
        });

        Schema::table('interests', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    }
};
