<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('author_id');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['articulo', 'aviso', 'comunicado', 'material', 'evento'])->default('aviso');
            $table->date('published_at');
            $table->enum('status', ['activo', 'inactivo', 'borrador', 'pendiente'])->default('activo');
            $table->timestamp('last_modified')->useCurrent()->useCurrentOnUpdate();
            $table->string('image_url')->nullable();
            $table->text('summary')->nullable();
            $table->string('visibility', 20)->default('public');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('publications');
    }
};
