<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->string('claim_code')->unique();
            $table->foreignId('machine_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('bottles_count');
            $table->unsignedInteger('xp_value');
            $table->boolean('is_claimed')->default(false);
            $table->foreignId('claimed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('claimed_at')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();
            
            $table->index(['claim_code', 'is_claimed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
