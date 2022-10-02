<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class MainController extends Controller
{

    function users(Request $request, $id = "add")
    {
        if ($id == "add") {
            $user = new User;
        } else {
            $user = User::find($id);
        }

        $user->email = $request->email ? $request->email : $user->email;
        $user->password = $request->password ? Hash::make($request->password) : $user->password;

        if ($user->save()) {
            return response()->json([
                "status" => "Success",
                "data" => $user
            ]);
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error creating a model"
        ]);
    }
}
