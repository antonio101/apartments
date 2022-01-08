<?php

namespace App\Search;

use App\Models\Apartment;
use Illuminate\Http\Request;

class ApartmentSearch
{
    public static function apply(Request $filters)
    {
        $apartment = (new Apartment)->newQuery();

        //if ($filters->has('user_id') && !is_null(auth()->user()) && auth()->user()->id == auth()->user()->id) {
        if ($filters->has('user_id')) {
            $apartment->where('user_id', $filters->input('user_id'));
        }

        if ($filters->has('features')) {

            foreach ($filters->input('features') as $feature_id) {
                $apartment->whereHas('features', function($q) use ($feature_id){
                    $q->where('features.id', $feature_id);
                });
            }
        }

        return $apartment->orderBy('created_at', 'desc')->get();
    }
}