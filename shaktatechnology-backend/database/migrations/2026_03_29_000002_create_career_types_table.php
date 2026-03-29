<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Seed the default types that match the existing enum values
        DB::table('career_types')->insert([
            ['name' => 'Full-time', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Part-time', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Internship', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Contract', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('career_types');
    }
};
