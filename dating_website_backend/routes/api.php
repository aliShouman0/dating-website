<?php

use App\Http\Controllers\MainController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group([
    'prefix' => 'auth'

], function () {

    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
    Route::post('payload', [AuthController::class, 'payload']);
});

Route::group(["prefix" => "v0.1"], function () {
    Route::group(["middleware" => "jwt"], function () {
        Route::post('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        // get all user that user may be interested_in
        Route::get("interested_in/{id}/{interested_in}", [MainController::class, "interested_in"])->name("interested-in");
        // get all fav user
        Route::get("favorites/{id}", [MainController::class, "get_favorites"])->name("get-favorites");
        // block user
        Route::post("block", [MainController::class, "block"])->name("block-user");
        // add  user to favorite list
        Route::post("favor", [MainController::class, "favor"])->name("favor-user");
    });

    // add/signup  user
    Route::post("signup", [MainController::class, "signup"])->name("signup");
    //login
    Route::post('login', [AuthController::class, 'login']);
});



// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
