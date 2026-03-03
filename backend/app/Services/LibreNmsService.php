<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LibreNmsService
{
    protected $baseUrl;
    protected $token;

    public function __construct()
    {
        $this->baseUrl = env('LIBRENMS_URL');
        $this->token = env('LIBRENMS_TOKEN');
    }

    public function getAllDevices()
    {
        try {
            // Kita kasih timeout 10 detik agar tidak Gateway Timeout lagi
            $response = Http::withHeaders([
                'X-Auth-Token' => $this->token,
            ])->timeout(10)->get("{$this->baseUrl}/devices");

            if ($response->successful()) {
                return $response->json()['devices'] ?? [];
            }

            Log::error("LibreNMS API Error: " . $response->status());
            return [];
        } catch (\Exception $e) {
            Log::error("Koneksi LibreNMS Gagal: " . $e->getMessage());
            return [];
        }
    }
}
