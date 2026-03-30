<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->integer('member_order')->nullable()->unique()->after('id');
            // $table->text('about')->nullable()->change(); // Requires dbal
            $table->dropColumn(['short_description', 'training', 'reference']);
        });

        // Use raw SQL to make about nullable instead of change()
        DB::statement('ALTER TABLE members MODIFY about TEXT NULL');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('member_order');
            // $table->text('about')->nullable(false)->change(); // Requires dbal
            $table->string('short_description', 500)->nullable()->after('address');
            $table->text('training')->nullable()->after('short_description');
            $table->string('reference', 255)->nullable()->after('education');
        });

        // Use raw SQL to make about NOT NULL again if needed (but nullable is better)
        DB::statement('ALTER TABLE members MODIFY about TEXT NOT NULL');
    }
};
