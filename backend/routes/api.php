<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WorkerController;
use Illuminate\Support\Facades\Route;

// 인증
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->middleware('throttle:10,1');
Route::post('/worker/otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/worker/verify', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');
Route::post('/admin/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/worker/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// 공고 — 비로그인 열람
Route::get('/jobs', [WorkerController::class, 'jobs']);
Route::get('/jobs/{project}', [WorkerController::class, 'job']);

// 관리자 콘솔
Route::prefix('admin')->middleware(['auth:sanctum', 'abilities:admin'])->controller(AdminController::class)->group(function () {
    Route::get('/dashboard', 'dashboard');
    Route::get('/projects', 'projects');
    Route::post('/projects', 'createProject');
    Route::get('/postings/duplicates', 'duplicates');
    Route::get('/projects/{project}', 'project');
    Route::patch('/projects/{project}', 'updateProject');
    Route::post('/projects/{project}/positions', 'addPosition');
    Route::post('/projects/{project}/invite', 'invite');
    Route::get('/projects/{project}/applicants', 'applicants');
    Route::post('/applications/status', 'setApplicationStatus');
    Route::get('/workers/{worker}', 'worker');
    Route::post('/workers/{worker}/photo', 'reviewPhoto');
    Route::get('/projects/{project}/contracts', 'contracts');
    Route::post('/projects/{project}/contracts/send', 'sendContracts');
    Route::post('/contracts/{contract}/resend', 'resendContract');
    Route::get('/projects/{project}/attendance', 'attendance');
    Route::post('/projects/{project}/attendance-code', 'rotateCode');
    Route::post('/applications/{application}/attendance', 'manualAttendance');
    Route::get('/projects/{project}/settlements', 'settlements');
    Route::post('/projects/{project}/settlements/calculate', 'calculate');
    Route::post('/projects/{project}/settlements/issue', 'issue');
});

// 워커 앱
Route::prefix('worker')->middleware(['auth:sanctum', 'abilities:worker'])->controller(WorkerController::class)->group(function () {
    Route::get('/me', 'profile');
    Route::put('/me', 'updateProfile');
    Route::post('/me/photo', 'uploadPhoto');
    Route::post('/records', 'addRecord');
    Route::get('/applications', 'applications');
    Route::post('/applications', 'apply');
    Route::get('/contract', 'contract');
    Route::post('/contracts/{contract}/sign', 'sign');
    Route::get('/shift', 'shift');
    Route::post('/attendance', 'attend');
    Route::get('/settlements', 'settlements');
    Route::post('/settlements/{settlement}/dispute', 'dispute');
});
