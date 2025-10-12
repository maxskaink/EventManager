<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Certificado', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre');
            $table->string('descripcion');
            $table->date('fecha_expedicion');
            $table->string('url_documento')->nullable();
            $table->string('comentario')->nullable();
            $table->boolean('eliminado')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Certificado');
    }
};
