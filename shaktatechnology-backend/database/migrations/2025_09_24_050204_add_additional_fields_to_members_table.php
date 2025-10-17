<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
            $table->string('address', 255)->nullable()->after('github');
            $table->string('short_description', 500)->nullable()->after('address');
            $table->text('training')->nullable()->after('short_description');
            $table->text('education')->nullable()->after('training');
            $table->string('reference', 255)->nullable()->after('education');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['address','short_description','training','education','reference']);
        });
    }
};
