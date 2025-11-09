<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();

            // Reference to the user who owns this certificate
            $table->unsignedBigInteger('user_id');

            // Certificate or license name (e.g., "Getting Started with Deep Learning")
            $table->string('name');

            // Organization that issued the certificate (e.g., "NVIDIA", "Coursera")
            $table->string('issuing_organization');

            // Date when the certificate was issued
            $table->date('issue_date');

            // Optional expiration date (nullable, since not all certificates expire)
            $table->date('expiration_date')->nullable();

            // Optional credential ID (e.g., "M0S7oiZMQc09R66P9O6-Q")
            $table->string('credential_id')->nullable();

            // Optional credential verification URL (e.g., "https://learn.nvidia.com/certificates?id=...")
            $table->string('credential_url')->nullable();

            // Indicates if the certificate does not expire (checkbox behavior)
            $table->boolean('does_not_expire')->default(false);

            // Soft-delete flag (used instead of physical deletion)
            $table->boolean('deleted')->default(false);

            // Creation and update timestamps
            $table->timestamps();

        });
    }

    public function down(): void {
        Schema::dropIfExists('certificates');
    }
};
