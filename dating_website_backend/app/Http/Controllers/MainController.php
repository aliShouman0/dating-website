<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Favorite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;



class MainController extends Controller
{
    // turn base64string to image (.jpeg)
    function base64_to_jpeg($base64_string, $output_file)
    {
        // open the output file for writing
        $ifp = fopen($output_file, 'wb');
        // split the string on commas
        // $data[ 0 ] == "data:image/png;base64"
        // $data[ 1 ] == <actual base64 string>
        $data = explode(',', $base64_string);
        // we could add validation here with ensuring count( $data ) > 1
        fwrite($ifp, base64_decode($data[0]));
        // clean up the file resource
        fclose($ifp);
        return $output_file;
    }


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


    // get all fav user
    function favorite($id)
    {
        $res = Favorite::where("user_id", $id)->get();
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
