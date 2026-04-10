<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->enum('revision_seguridad', ['pendiente', 'limpio', 'sospechoso', 'peligroso'])
                  ->default('pendiente')
                  ->after('exportado_excel');
            $table->text('detalle_seguridad')->nullable()->after('revision_seguridad');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['revision_seguridad', 'detalle_seguridad']);
        });
    }
};
