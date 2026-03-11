<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Onu extends Model
{
    use HasFactory;

    protected $fillable = [
        'odp_id', 'mac_address', 'snmp_index', 'customer_name', 
        'latitude', 'longitude', 'is_active'
    ];

    // ONU ini nyambung ke satu ODP
    public function odp()
    {
        return $this->belongsTo(Odp::class);
    }

    // Satu ONU punya banyak riwayat redaman
    public function signalLogs()
    {
        return $this->hasMany(OnuSignalLog::class);
    }
}