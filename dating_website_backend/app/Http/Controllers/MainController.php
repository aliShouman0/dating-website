<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Favorite;
use App\Models\BlockedUser;
use App\Models\Chat;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;



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

    // get all user that intersted in
    function interested_in($id, $interested_in)
    {

        $res = User::where("gender", $interested_in)
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
    function get_favorites($id)
    {
        $res = Favorite::where("user_id", $id)
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
        $user = new BlockedUser;
        if ($request->user_id && $request->blocked_user_id) {
            $user->user_id = $request->user_id;
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

    // add  user to favorite list
    function favor(Request $request)
    {
        $favor = new Favorite;
        if ($request->user_id && $request->favorite_id) {
            $favor->user_id = $request->user_id;
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
    function messages($id, $sender_id)
    {
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
        $message = new Chat;
        if ($request->sender_id && $request->receiver_id && $request->text) {
            $message->sender_id = $request->sender_id;
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
    function users_message($id)
    {
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
