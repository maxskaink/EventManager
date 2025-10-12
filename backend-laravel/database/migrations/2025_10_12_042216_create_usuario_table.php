<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Usuario', function (Blueprint $table) {
            $table->id();
            $table->string('correo', 50)->unique();
            $table->enum('rol', ["interesado", "integrante", "coordinador", "mentor"])->default('interesado');
            $table->date('fecha_creacion');
            $table->timestamp('ultimo_inicio_sesion');
            $table->boolean('eliminado')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Usuario');
    }
};
