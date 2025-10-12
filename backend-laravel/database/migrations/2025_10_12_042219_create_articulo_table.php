<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Articulo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->string('titulo')->nullable();
            $table->string('descripcion')->nullable();
            $table->date('fecha_publicacion')->nullable();
            $table->string('autores')->nullable();
            $table->string('url_publicacion')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Articulo');
    }
};
