<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Cek email dan password
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah!'
            ], 401);
        }

        // Jika berhasil, buat token Sanctum
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('affnet_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => $user->name
        ]);
    }
}
