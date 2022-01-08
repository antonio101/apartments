<?php
namespace App\Notifier;

use App\Notifier\BookingNotifier;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingRequest;
use App\Models\Booking;

class MailBookingNotifier extends BookingNotifier
{
    public function __construct(Booking $booking, string $apartment_url) {
        parent::__construct($booking, $apartment_url);
    }

    public function send() {
        $recipient = $this->booking->apartment->user->email;

        Mail::to($recipient)->send(new BookingRequest($this->booking, $this->apartment_url));
        Log::info('Emailed booking request ' . $this->booking->id);
    }

}
