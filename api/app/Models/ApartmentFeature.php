<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartmentFeature extends Model
{
    use HasFactory;

    /**
    * The attributes that should be hidden for arrays.
    *
    * @var array
    */
    protected $fillable = [
        'apartment_id',
        'feature_id'
    ];

    protected $casts = [
        'apartment_id' => 'integer',
        'feature_id'   => 'integer',
    ];
}
