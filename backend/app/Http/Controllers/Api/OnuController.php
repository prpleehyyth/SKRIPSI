<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Onu;
use Illuminate\Http\Request;

class OnuController extends Controller
{
    public function index()
    {
        // Ambil ONU aktif + data ODP + 1 data redaman paling baru
        $onus = Onu::with(['odp', 'signalLogs' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(1);
        }])
        ->where('is_active', true)
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data koordinat dan redaman FTTH berhasil ditarik',
            'data'    => $onus
        ]);
    }
}