<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('participations', function (Blueprint $table) {
            $table->id(); // use an independent primary key
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['inscrito', 'asistio', 'ausente', 'cancelado'])->default('inscrito');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('participations');
    }
};
