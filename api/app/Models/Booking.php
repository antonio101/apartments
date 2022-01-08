<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'birthday',
        'approved',
        'apartment_id',
    ];
    
    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }

    protected $casts = [
        'apartment_id' => 'integer',
    ];

}
