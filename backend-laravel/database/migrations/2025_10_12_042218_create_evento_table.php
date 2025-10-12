<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Evento', function (Blueprint $table) {
            $table->id('id_evento');
            $table->string('nombre');
            $table->string('descripcion');
            $table->string('lugar');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('tipo_evento');
            $table->string('estado', 50);
            $table->integer('aforo')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Evento');
    }
};
