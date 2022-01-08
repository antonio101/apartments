<?php

namespace App\Http\Controllers\API;

use App\Models\Booking;
use App\Models\Apartment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Jobs\SendBookingRequestNotification;
use App\Notifier\MailBookingNotifier;
use Illuminate\Support\Facades\Validator;
use App\Rules\CheckIsAdultRule;
use App\Search\BookingSearch;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $request->merge(['user_id' => auth()->user()->id]);
        $data = BookingSearch::apply($request);
        return response()->json(BookingResource::collection($data));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name'         => 'required|string|max:255',
            'birthday'     =>  ['required', 'date_format:Y-m-d', new CheckIsAdultRule()],
            'apartment_id' => 'required|integer',
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Check if this apartment exists
        $apartment = Apartment::where('id', $request->apartment_id)->first();

        if ($apartment === null) {
            return response()->json(['error' => 'Invalid apartment.'], 400);
        }

        // Can't book his/her own apartment
        if (!is_null(auth()->user()) && $apartment->user_id == auth()->user()->id) {
            return response()->json(['error' => ['Permission denied']], 403);
        }

        // If there is a booking approved for this apartment
        $bookings = Booking::where([
            'apartment_id' => $request->apartment_id,
            'approved'     => true
        ])->first();

        
        if ($bookings !== null) {
            return response()->json(['error' => 'Apartment not available.'], 400);
        }

        $booking = Booking::create([
            'name'         => $request->name,
            'birthday'     => $request->birthday,
            'apartment_id' => $request->apartment_id
        ]);

        // TODO: Hardcoded URL --<(o.o)>--
        $apartment_url  = 'http://localhost:8080/apartments/' . $booking->apartment->id;

        $notifier = new MailBookingNotifier($booking, $apartment_url);
        SendBookingRequestNotification::dispatch($notifier);
        
        return response()->json(new BookingResource($booking), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $booking = Booking::find($id);

        if (is_null($booking)) {
            return response()->json(null, 404); 
        }

        return response()->json(new BookingResource($booking), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (is_null($booking)) {
            return response()->json(null, 404); 
        }

        $validator = Validator::make($request->all(),[
            'approved' => 'required|boolean',
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $apartment = Apartment::find($booking->apartment_id);

        if (!is_null(auth()->user()) && $apartment->user_id != auth()->user()->id) {
            return response()->json(['error' => ['Permission denied']], 403);
        }

        $approved_bookings = $apartment->bookings->filter(function ($booking, $key) {
            return $booking->approved == true;
        });
        
        if ($approved_bookings->count() > 0) {
            return response()->json(['error' => ['Another booking request has been approved previously.']], 400);
        }

        $booking->approved = $request->approved;
        $booking->save();
        
        return response()->json(new BookingResource($booking), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();

        return response()->json(null, 204);
    }
}