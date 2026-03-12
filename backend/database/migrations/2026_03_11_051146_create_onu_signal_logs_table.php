<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('onu_signal_logs', function (Blueprint $table) {
            $table->id();
            // Ini kolom yang dicari sama PostgreSQL:
            $table->foreignId('onu_id')->constrained('onus')->cascadeOnDelete();
            
            $table->float('rx_power');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onu_signal_logs');
    }
};
