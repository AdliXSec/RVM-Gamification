<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreignId('receipt_id')->nullable()->constrained('receipts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Cannot easily revert nullable change in SQLite, but we drop receipt_id
            $table->dropForeign(['receipt_id']);
            $table->dropColumn('receipt_id');
        });
    }
};
