<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class JWT
{ 
    public function handle(Request $request, Closure $next)
    {
        //more layer of scurty by test in Middleware jwt insted of going to AuthController
        JWTAuth::parseToken()->authenticate();
        return $next($request);
    }
}
