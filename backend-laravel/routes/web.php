<?php

use Illuminate\Support\Facades\Route;
use http\Env\Request;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get(' /auth/google/redirect', function (Request $request) {
    return Socialite::driver('google')->redirect();
});

Route::get(' /auth/google/callback', function (Request $request) {

});
