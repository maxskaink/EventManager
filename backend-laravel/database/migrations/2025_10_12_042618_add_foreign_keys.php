<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Usuario -> Perfil
        Schema::table('Perfil', function (Blueprint $table) {
            $table->foreign('id_usuario')->references('id')->on('Usuario')->onDelete('cascade');
        });

        // Usuario -> Certificado
        Schema::table('Certificado', function (Blueprint $table) {
            $table->foreign('id_usuario')->references('id')->on('Usuario');
        });

        // Perfil -> Interes
        Schema::table('Interes', function (Blueprint $table) {
            $table->foreign('id_usuario')->references('id_usuario')->on('Perfil');
        });

        // Usuario -> Participacion
        Schema::table('Participacion', function (Blueprint $table) {
            $table->foreign('id_usuario')->references('id')->on('Usuario');
        });

        // Evento -> Participacion
        Schema::table('Participacion', function (Blueprint $table) {
            $table->foreign('id_evento')->references('id_evento')->on('Evento');
        });

        // Publicacion -> Interes_publicacion
        Schema::table('Interes_publicacion', function (Blueprint $table) {
            $table->foreign('id_publicacion')->references('id')->on('Publicacion');
        });

        // Perfil -> Publicacion (autor_id)
        Schema::table('Publicacion', function (Blueprint $table) {
            $table->foreign('autor_id')->references('id_usuario')->on('Perfil');
        });

        // Publicacion -> Acceso_publicacion
        Schema::table('Acceso_publicacion', function (Blueprint $table) {
            $table->foreign('id_publicacion')->references('id')->on('Publicacion');
        });

        // Perfil -> Acceso_publicacion
        Schema::table('Acceso_publicacion', function (Blueprint $table) {
            $table->foreign('id_perfil')->references('id_usuario')->on('Perfil');
        });

        // Usuario -> Articulo
        Schema::table('Articulo', function (Blueprint $table) {
            $table->foreign('id_usuario')->references('id')->on('Usuario');
        });

        // Perfil -> Notificacion
        Schema::table('Notificacion', function (Blueprint $table) {
            $table->foreign('id_perfil')->references('id_usuario')->on('Perfil');
        });
    }

    public function down(): void
    {
        // Elimina las claves foráneas en orden inverso
        Schema::table('Notificacion', function (Blueprint $table) {
            $table->dropForeign(['id_perfil']);
        });
        Schema::table('Articulo', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
        });
        Schema::table('Acceso_publicacion', function (Blueprint $table) {
            $table->dropForeign(['id_perfil']);
            $table->dropForeign(['id_publicacion']);
        });
        Schema::table('Publicacion', function (Blueprint $table) {
            $table->dropForeign(['autor_id']);
        });
        Schema::table('Interes_publicacion', function (Blueprint $table) {
            $table->dropForeign(['id_publicacion']);
        });
        Schema::table('Participacion', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropForeign(['id_usuario']);
        });
        Schema::table('Interes', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
        });
        Schema::table('Certificado', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
        });
        Schema::table('Perfil', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
        });
    }
};