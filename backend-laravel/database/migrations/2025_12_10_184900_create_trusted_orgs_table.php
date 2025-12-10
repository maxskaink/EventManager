<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trusted_orgs', function (Blueprint $table) {
            $table->id();
            $table->string('org')->unique()->comment('Organization name');
            $table->boolean('trusted_for_certificate')->default(false)->comment('Trusted for certificate issuance');
            $table->boolean('trusted_for_event')->default(false)->comment('Trusted for event management');
            $table->boolean('trusted_for_publication')->default(false)->comment('Trusted for publications');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trusted_orgs');
    }
};
