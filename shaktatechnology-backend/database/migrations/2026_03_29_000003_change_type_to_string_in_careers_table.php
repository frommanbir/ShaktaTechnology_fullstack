<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            // Drop enum column, re-add as string to allow dynamic types
            $table->dropColumn('type');
        });
        Schema::table('careers', function (Blueprint $table) {
            $table->string('type')->default('Full-time')->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('careers', function (Blueprint $table) {
            $table->enum('type', ['Full-time', 'Part-time', 'Internship', 'Contract'])
                  ->default('Full-time')->after('location');
        });
    }
};
