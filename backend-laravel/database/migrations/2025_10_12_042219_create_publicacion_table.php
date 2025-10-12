<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Publicacion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('autor_id');
            $table->string('titulo');
            $table->string('contenido');
            $table->string('tipo');
            $table->date('fecha_publicacion');
            $table->string('estado', 50);
            $table->date('ultima_modificacion');
            $table->string('url_imagen')->nullable();
            $table->string('resumen')->nullable();
            $table->string('visibilidad', 20);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Publicacion');
    }
};
