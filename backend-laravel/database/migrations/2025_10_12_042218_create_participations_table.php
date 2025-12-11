<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Creates the participations table to track user participation in events.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('participations', function (Blueprint $table) {
            $table->id(); // use an independent primary key
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['inscrito', 'asistio', 'ausente', 'cancelado'])->default('inscrito');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('participations');
    }
};
