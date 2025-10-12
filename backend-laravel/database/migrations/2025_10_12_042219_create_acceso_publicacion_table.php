<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Acceso_publicacion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_perfil');
            $table->unsignedBigInteger('id_publicacion');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Acceso_publicacion');
    }
};
