<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $landlord;
    public $booking;
    public $apartment;
    public $apartment_url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Booking $booking, string $apartment_url)
    {
        $this->booking       = $booking;
        $this->apartment     = $booking->apartment;
        $this->landlord      = $booking->apartment->user;
        $this->apartment_url = $apartment_url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.bookings.request');
    }
}
