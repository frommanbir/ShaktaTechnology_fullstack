<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('title');
        });

        DB::table('careers')->orderBy('id')->get(['id', 'title'])->each(function ($row) {
            $base = Str::slug($row->title) ?: 'career-' . $row->id;
            $slug = $base;
            $counter = 2;

            while (DB::table('careers')->where('slug', $slug)->where('id', '!=', $row->id)->exists()) {
                $slug = "{$base}-{$counter}";
                $counter++;
            }

            DB::table('careers')->where('id', $row->id)->update(['slug' => $slug]);
        });
    }

    public function down(): void
    {
        Schema::table('careers', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
