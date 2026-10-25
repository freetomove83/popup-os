<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('positions', function (Blueprint $table) {
            $table->string('pay_type', 10)->default('hourly')->after('pay'); // hourly | daily
        });
        Schema::table('projects', function (Blueprint $table) {
            $table->text('source_text')->nullable()->after('description'); // 붙여넣은 원문(카톡 공고 등)
        });
    }

    public function down(): void
    {
        Schema::table('positions', fn (Blueprint $table) => $table->dropColumn('pay_type'));
        Schema::table('projects', fn (Blueprint $table) => $table->dropColumn('source_text'));
    }
};
