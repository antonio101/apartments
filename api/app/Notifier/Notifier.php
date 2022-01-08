<?php
namespace App\Notifier;

use App\Models\Booking;

interface Notifier
{
    public function __construct(Booking $booking, string $apartment_url);
    public function send();
}