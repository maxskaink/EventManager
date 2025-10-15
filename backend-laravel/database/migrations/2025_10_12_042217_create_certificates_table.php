<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('name');
            $table->string('description');
            $table->date('issue_date');
            $table->string('document_url')->nullable();
            $table->string('comment')->nullable();
            $table->boolean('deleted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('certificates');
    }
};
