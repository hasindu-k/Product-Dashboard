<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create($data);
        $token = JWTAuth::fromUser($user);

        return $this->response([
            'message' => 'Account created successfully.',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return $this->response([
                    'message' => 'Email or password is incorrect.',
                ], 401, false);
            }
        } catch (JWTException $e) {
            Log::error('JWT login failed.', [
                'email' => $request->input('email'),
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to log in. Please try again.',
            ], 500, false);
        }

        return $this->response([
            'message' => 'Login successful.',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => auth('api')->user(),
        ]);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            Log::warning('JWT logout failed.', [
                'user_id' => auth('api')->id(),
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to log out. Please try again.',
            ], 401, false);
        }

        return $this->response(['message' => 'Logged out successfully.']);
    }

    public function refresh()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
        } catch (JWTException $e) {
            Log::warning('JWT refresh failed.', [
                'user_id' => auth('api')->id(),
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to refresh token. Please log in again.',
            ], 401, false);
        }

        return $this->response([
            'message' => 'Token refreshed successfully.',
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}
