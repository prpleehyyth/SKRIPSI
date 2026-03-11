<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('odps', function (Blueprint $table) {
            $table->id();
            // Ini lho kolom yang bikin error tadi karena belum ada
            $table->unsignedBigInteger('librenms_device_id')->comment('ID OLT di LibreNMS'); 
            
            $table->string('name')->unique()->comment('Nama ODP, misal: ODP-01-Utara');
            $table->integer('capacity')->default(8)->comment('Kapasitas port ODP');
            
            // Titik koordinat tiang ODP untuk GIS
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('odps');
    }
};
