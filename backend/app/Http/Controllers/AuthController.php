<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function adminLogin(Request $request)
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => '이메일 또는 비밀번호가 올바르지 않아요.']);
        }

        return ['token' => $user->createToken('admin', ['admin'])->plainTextToken, 'name' => $user->name];
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    private static function digits(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }

    /**
     * 인증번호 발송.
     * shortcut: 실제 SMS/알림톡 미연동 — 코드는 로그에 남기고 local 환경에서만 응답에 포함. 발송 업체 계약 후 교체.
     */
    public function sendOtp(Request $request)
    {
        $phone = self::digits($request->validate(['phone' => 'required|string'])['phone']);
        if (! preg_match('/^01\d{8,9}$/', $phone)) {
            throw ValidationException::withMessages(['phone' => '휴대폰 번호를 확인해 주세요.']);
        }
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put("otp:{$phone}", ['code' => $code, 'tries' => 0], now()->addMinutes(5));
        Log::info("OTP {$phone}: {$code}");

        return app()->isLocal() ? ['sent' => true, 'debugCode' => $code] : ['sent' => true];
    }

    public function verifyOtp(Request $request)
    {
        $data = $request->validate(['phone' => 'required|string', 'code' => 'required|string']);
        $phone = self::digits($data['phone']);
        $entry = Cache::get("otp:{$phone}");
        if (! $entry || $entry['tries'] >= 5) {
            Cache::forget("otp:{$phone}");
            throw ValidationException::withMessages(['code' => '인증번호가 만료됐어요. 다시 받아 주세요.']);
        }
        if (! hash_equals($entry['code'], self::digits($data['code']))) {
            Cache::put("otp:{$phone}", ['code' => $entry['code'], 'tries' => $entry['tries'] + 1], now()->addMinutes(5));
            throw ValidationException::withMessages(['code' => '인증번호가 일치하지 않아요.']);
        }
        Cache::forget("otp:{$phone}");

        $worker = Worker::firstOrCreate(['phone' => $phone]);

        return [
            'token' => $worker->createToken('worker', ['worker'])->plainTextToken,
            'onboarding' => ! $worker->name,
        ];
    }
}
