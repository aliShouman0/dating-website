<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    public function User_receiver()
    {
        return $this->belongsTo(User::class, "receiver_id");
    }
    public function User_sender()
    {
        return $this->belongsTo(User::class, "sender_id");
    }
}
