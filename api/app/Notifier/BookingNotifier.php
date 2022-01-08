<?php
namespace App\Notifier;

use App\Models\Booking;
use App\Models\Apartment;

abstract class BookingNotifier
{
    protected $booking;
    protected $apartment_url;

    public function __construct(Booking $booking, string $apartment_url) {

        $this->booking       = $booking;
        $this->apartment_url = $apartment_url;

        if (!isset($booking->apartment)) {
            $this->booking->apartment = Apartment::find($booking->apartment_id);
        }
    }

    public function send() {
        throw new \Exception('Not implemented'); 
    }
}