<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Perfil', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre');
            $table->string('telefono')->nullable();
            $table->string('url_avatar')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Perfil');
    }
};
