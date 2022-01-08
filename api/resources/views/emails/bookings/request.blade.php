@component('mail::message')
{{--Notice: Exposing this personal data here is against the GDPR--}}

Hello {{ $landlord->name }}


An user has just requested a booking for your apartment.


Apartment: {{ $apartment->title }}

Applicant: {{ $booking->name }}

@component('mail::button', ['url' => $apartment_url])
    View apartment
@endcomponent


Thanks!

@endcomponent 