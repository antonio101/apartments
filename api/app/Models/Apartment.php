<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Apartment extends Model
{
    use HasFactory;
    protected $guarded = [];
    
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class);
    }

    protected $casts = [
        'user_id' => 'integer',
    ];
}
