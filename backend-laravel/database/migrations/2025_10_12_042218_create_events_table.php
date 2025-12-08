<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Creates the events table to store event information including talks, courses, and workshops.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('publication_id')->nullable();
            $table->string('name');
            $table->text('description');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('event_type', ['charla', 'curso', 'convocatoria', 'taller', 'conferencia'])->default('charla');
            $table->enum('modality', ['presencial', 'virtual', 'mixta'])->default('presencial');
            $table->string('location')->nullable();
            $table->string('virtual_url')->nullable();
            $table->string('status', 50);
            $table->integer('capacity')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
