<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ApartmentController;
use App\Http\Controllers\API\FeatureController;
use App\Http\Controllers\API\AuthController;

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

Route::group(['middleware' => ['auth.apikey']], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // Protecting Routes
    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::get('/profile', function(Request $request) {
            return auth()->user();
        });

        Route::post('/logout', [AuthController::class, 'logout']);

        Route::prefix('apartments')->group(function () {
            Route::put('/{id}', [ApartmentController::class, 'update']);
            Route::post('/',    [ApartmentController::class, 'store']);
        });

        Route::put('/bookings/{id}', [BookingController::class, 'update']);
        Route::get('/bookings',      [BookingController::class, 'index']);

    });

    Route::prefix('apartments')->group(function () {
        Route::get('/{id}', [ApartmentController::class, 'show'])->middleware('auth.apikey');
        Route::get('/',     [ApartmentController::class, 'index']);
    });

    Route::prefix('bookings')->group(function () {
        Route::get('/{id}', [BookingController::class, 'show']);
        Route::post('/',    [BookingController::class, 'store']);
    });

    Route::prefix('features')->group(function () {
        Route::get('/{id}', [FeatureController::class, 'show']);
        Route::get('/',     [FeatureController::class, 'index']);
    });
});