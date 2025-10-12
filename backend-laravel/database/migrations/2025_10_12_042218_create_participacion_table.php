<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Participacion', function (Blueprint $table) {
            $table->id('id_evento');
            $table->unsignedBigInteger('id_usuario');
            $table->string('estado', 50);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Participacion');
    }
};
