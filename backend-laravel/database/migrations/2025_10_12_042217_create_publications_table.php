<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Creates the publications table to store articles, announcements, and other content.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('author_id');
            $table->unsignedBigInteger('event_id')->nullable();
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['articulo', 'aviso', 'comunicado', 'material', 'evento'])->default('aviso');
            $table->enum('status', ['activo', 'inactivo', 'borrador', 'pendiente'])->default('activo');
            $table->string('image_url')->nullable();
            $table->string('document_url')->nullable();
            $table->text('summary')->nullable();
            $table->string('visibility', 20)->default('public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
