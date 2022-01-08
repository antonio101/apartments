<?php

namespace App\Search;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingSearch
{
    public static function apply(Request $filters)
    {
        $booking = (new Booking)->newQuery();

        if ($filters->has('user_id')) {
            $booking->whereHas('apartment', function($q) use ($filters) {
                $q->where('user_id', $filters->input('user_id'));
            });
        }

        if ($filters->has('apartment_id')) {
            $booking->where('apartment_id', $filters->input('apartment_id'));
        }

        return $booking->orderBy('created_at', 'desc')->get();
    }
}