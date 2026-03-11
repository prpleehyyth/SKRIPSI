<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Odp extends Model
{
    use HasFactory;

    protected $fillable = [
        'librenms_device_id', 'name', 'capacity', 'latitude', 'longitude'
    ];

    // Satu ODP bisa punya banyak ONU (Pelanggan)
    public function onus()
    {
        return $this->hasMany(Onu::class);
    }
}