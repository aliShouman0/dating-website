<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class MainController extends Controller
{

    function signup(Request $request)
    {
        // create new user
        $user = new User;
        if (
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
            $user->email =  $request->email;
            $user->age =  $request->age;
            $user->location =  $request->location;
            $user->bio =  $request->bio;
            $user->gender =  $request->gender;
            $user->interested_in =  $request->interested_in;
            $user->invisible =  $request->invisible;
            $user->password =  Hash::make($request->password);
            if ($request->picture) {
                $user->picture = $request->picture;
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


    // get all user that intersted in
    function interested_in($id, $interested_in)
    {

        $res = User::where("interested_in", $interested_in)
            ->whereNot("id", $id)->get();
        if ($res) {

            return response()->json([
                "status" => "Success",
                "data" => $res
            ]);
        }
        return response()->json([
            "status" => "Error",
            "data" => "Error -Some Thing went wrong "
        ], 400);
    }


    // //       
    // $user->email = $request->email ? $request->email : $user->email;
    // $user->age = $request->age ? $request->age : $user->age;
    // $user->location = $request->location ? $request->location : $user->location;
    // $user->bio = $request->bio ? $request->bio : $user->bio;
    // $user->gender = $request->gender ? $request->gender : $user->gender;
    // $user->interstes_in = $request->interstes_in ? $request->interstes_in : $user->interstes_in;
    // $user->invisible = $request->invisible ? $request->invisible : $user->invisible;        
    // $user->password = $request->password ? Hash::make($request->password) : $user->password;

}
