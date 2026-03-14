<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibreController;
use App\Http\Controllers\Api\OnuController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ─── RUTE PUBLIK (Tidak perlu Token) ────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);


// ─── RUTE TERPROTEKSI (Wajib bawa Token JWT Sanctum) ────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Rute untuk mendapatkan data user yang sedang aktif
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rute Inventaris LibreNMS yang kemarin sudah kamu buat
    Route::get('/inventory', [LibreController::class, 'index']);

    // Rute Logout untuk menghapus token dari database (Opsional)
    // Route::post('/logout', [AuthController::class, 'logout']);

    // TODO: Nanti rute GIS Map untuk redaman OLT bisa ditaruh di sini
    // Route::get('/gis-map', [LibreController::class, 'getGisMap']);

    Route::get('/onus', [OnuController::class, 'index']);

    

});
