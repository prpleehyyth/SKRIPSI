<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnuSignalLog extends Model
{
    use HasFactory;

    // Matikan timestamps bawaan karena kita cuma pakai created_at manual
    public $timestamps = false;

    protected $fillable = [
        'onu_id', 'rx_power', 'status', 'created_at'
    ];

    // Log ini milik satu ONU
    public function onu()
    {
        return $this->belongsTo(Onu::class);
    }
}