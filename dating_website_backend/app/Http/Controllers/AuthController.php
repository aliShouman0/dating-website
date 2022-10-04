<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;


class AuthController extends Controller
{

    // public function __construct()
    // {
    //    // $this->middleware('jwt', ['except' => ['login']]);
    // }


    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }


    public function me()
    {
        return response()->json(auth()->user());
    }


    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }


    function edit()
    {
        function signup(Request $request)
        {
            // create new user
            $user = new User;
            if (
                $request->name &&
                $request->email &&
                $request->age &&
                $request->location &&
                $request->bio &&
                $request->gender &&
                $request->interested_in &&
                $request->password &&
                isset($request->invisible)

            ) {

                //check if  all needed data are sended and save user
                $user->name =  $request->name;
                $user->email =  $request->email;
                $user->age =  $request->age;
                $user->location =  $request->location;
                $user->bio =  $request->bio;
                $user->gender =  $request->gender;
                $user->interested_in =  $request->interested_in;
                $user->invisible =  $request->invisible;
                $user->password =  Hash::make($request->password);
                if ($request->picture) {
                    $image_url_base64 = $request->picture;
                    // split the string on commas
                    // $data[ 0 ] == "data:image/png;base64"
                    // $data[ 1 ] == <actual base64 string>
                    $data = base64_decode(explode(',', $image_url_base64)[1]);
                    $save_name =   'user_images/' . uniqid() . '.png';
                    Storage::disk('local')->put($save_name,  $data);
                    $user->picture =   $save_name;
                } else {
                    $user->picture = '';
                }
                if ($user->save()) {
                    return response()->json([
                        "status" => "Success",
                        "data" => $user
                    ]);
                }
            }

            return response()->json([
                "status" => "Error",
                "data" => "Error -Some Data is missing"
            ], 400);
        }
    }


    function signup(Request $request)
    {
        // create new user
        $user = new User;
        if (
            $request->name &&
            $request->email &&
            $request->age &&
            $request->location &&
            $request->bio &&
            $request->gender &&
            $request->interested_in &&
            $request->password &&
            isset($request->invisible)

        ) {

            //check if  all needed data are sended and save user
            $user->name =  $request->name;
            $user->email =  $request->email;
            $user->age =  $request->age;
            $user->location =  $request->location;
            $user->bio =  $request->bio;
            $user->gender =  $request->gender;
            $user->interested_in =  $request->interested_in;
            $user->invisible =  $request->invisible;
            $user->password =  Hash::make($request->password);
            if ($request->picture) {
                $image_url_base64 = $request->picture;
                // split the string on commas
                // $data[ 0 ] == "data:image/png;base64"
                // $data[ 1 ] == <actual base64 string>
                $data = base64_decode(explode(',', $image_url_base64)[1]);
                $save_name =   'user_images/' . uniqid() . '.png';
                Storage::disk('local')->put($save_name,  $data);
                $user->picture =   $save_name;
            } else {
                $user->picture = '';
            }
            if ($user->save()) {
                return response()->json([
                    "status" => "Success",
                    "data" => $user
                ]);
            }
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error -Some Data is missing"
        ], 400);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }


    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }


    protected function payload()
    {
        return auth()->payload();
    }
}
