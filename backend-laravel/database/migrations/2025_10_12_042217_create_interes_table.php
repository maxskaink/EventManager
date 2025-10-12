<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('Interes', function (Blueprint $table) {
            $table->id('id_interes');
            $table->unsignedBigInteger('id_usuario');
            $table->string('palabra_clave');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('Interes');
    }
};
