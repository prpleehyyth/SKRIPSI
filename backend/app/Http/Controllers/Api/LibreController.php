<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LibreNmsService;
use Illuminate\Http\JsonResponse;

class LibreController extends Controller
{
    protected $libre;

    public function __construct(LibreNmsService $libre)
    {
        $this->libre = $libre;
    }

    public function index(): JsonResponse
    {
        $devices = $this->libre->getAllDevices();

        return response()->json([
            'status' => 'success',
            'count' => count($devices),
            'data' => $devices
        ]);
    }
}
