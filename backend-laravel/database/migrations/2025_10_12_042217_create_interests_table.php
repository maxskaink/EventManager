<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('interests', function (Blueprint $table) {
            $table->id('interest_id');
            $table->unsignedBigInteger('user_id');
            $table->string('keyword');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('interests');
    }
};
