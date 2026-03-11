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
        Schema::create('onus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('odp_id')->nullable()->constrained('odps')->onDelete('set null');
            
            $table->string('mac_address')->unique()->comment('MAC Address ONU dari SNMP');
            $table->integer('snmp_index')->nullable()->comment('Index OID dari hasil Walk');
            
            $table->string('customer_name')->comment('Nama Pelanggan');
            $table->text('address')->nullable()->comment('Alamat Pemasangan');
            
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onus');
    }
};
