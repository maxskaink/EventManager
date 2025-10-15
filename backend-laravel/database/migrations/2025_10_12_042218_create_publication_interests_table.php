<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('publication_interests', function (Blueprint $table) {
            $table->id('interest_id');
            $table->unsignedBigInteger('publication_id');
            $table->string('interest');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('publication_interests');
    }
};
