<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Favorite;
use App\Models\BlockedUser;
use App\Models\Chat;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;



class MainController extends Controller
{



    // get all user that intersted in
    function interested_in()
    {
        $id = Auth::id();
        $interested_in = Auth::user()->interested_in;
        $res = User::where("gender", $interested_in)
            ->where("invisible", "0")
            ->whereNot("id", $id)
            ->whereNotIn("id", BlockedUser::select('blocked_user_id')
                ->where("user_id", $id)
                ->get())
            ->get();
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

    // get all fav user
    function get_favorites()
    {
        $id = Auth::id();
        $res = Favorite::where("user_id", $id)->with("User")
            ->whereNotIn("favorite_id", BlockedUser::select('blocked_user_id')
                ->where("user_id", $id)
                ->get())
            ->get();
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

    //block user
    function block(Request $request)
    {
        $id = Auth::id();
        $user = new BlockedUser;
        if ($request->blocked_user_id) {
            $user->user_id =  $id;
            $user->blocked_user_id = $request->blocked_user_id;

            if ($user->save()) {
                return response()->json([
                    "status" => "Success",
                    "data" => $user
                ]);
            }
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error -Some Thing went wrong "
        ], 400);
    }

    // check if this user 'favor_id' already in fav  with the login user id
    function checkFav($favor_id)
    {
        $id = Auth::id();
        $favor = Favorite::where("user_id", $id)->where("favorite_id", $favor_id)->get();
        return     isset($favor[0]);
    }

    // add  user to favorite list
    function favor(Request $request)
    {
        $id = Auth::id();
        // check if already in fav favorite_id with  user_id
        if ($id && $request->favorite_id) {
            $status = $this->checkFav($request->favorite_id);
            if ($status) {
                return response()->json([
                    "status" => "exists",
                    "data" => $status
                ]);
            }
            $favor = new Favorite;
            $favor->user_id = $id;
            $favor->favorite_id = $request->favorite_id;
            if ($favor->save()) {
                return response()->json([
                    "status" => "Success",
                    "data" => $favor
                ]);
            }
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error -Some Thing went wrong "
        ], 400);
    }

    // get all message for a user
    function messages($sender_id)
    {
        $id = Auth::id();
        $res = Chat::where("receiver_id", $id)->where("sender_id", $sender_id)
            ->orWhere("sender_id", $id)->where("receiver_id", $sender_id)
            ->orderBy("date", "ASC")
            ->get();
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

    // send message
    function message(Request $request)
    {
        $id = Auth::id();
        $message = new Chat;
        if ($request->receiver_id && $request->text) {
            $message->sender_id = $id;
            $message->receiver_id = $request->receiver_id;
            $message->text = $request->text;
            $message->date = time();

            if ($message->save()) {
                return response()->json([
                    "status" => "Success",
                    "data" => $message
                ]);
            }
        }

        return response()->json([
            "status" => "Error",
            "data" => "Error -Some Thing went wrong "
        ], 400);
    }


    // get all user info who send or receiver message from this user
    function users_message()
    {
        $id = Auth::id();
        $res["senders"] = Chat::select("sender_id")->distinct()->with("User_sender")->where("receiver_id", $id)
            ->orderBy("date", "DESC")
            ->get();

        $res["receivers"] = Chat::select("receiver_id")->distinct()->with("User_receiver")->where("sender_id", $id)
            ->orderBy("date", "DESC")
            ->get();

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
}
