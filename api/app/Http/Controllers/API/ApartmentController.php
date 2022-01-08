<?php

namespace App\Http\Controllers\API;

use App\Models\Apartment;
use App\Search\ApartmentSearch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApartmentResource;
use App\Models\Feature;
use Illuminate\Support\Facades\Validator;

class ApartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = ApartmentSearch::apply($request);
        return response()->json(ApartmentResource::collection($data));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'required',
            'features'    => 'nullable|array',
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $apartment = Apartment::create([
            'title'       => $request->title,
            'description' => $request->description,
            'user_id'     => auth()->user()->id
        ]);
        
        if (is_array($request->features)) {
            $features = Feature::whereIn('id', $request->features)->get();
            $apartment->features()->attach($features); 
        }
    
        return response()->json(new ApartmentResource($apartment), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //$apartment = Apartment::with('booking', 'user')->where('id', $id)->first();
        $apartment = Apartment::find($id);

        if (is_null($apartment)) {
            return response()->json(null, 404); 
        }

        return response()->json(new ApartmentResource($apartment), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Apartment $apartment)
    {
        $validator = Validator::make($request->all(),[
            'title'       => 'required|string|max:255',
            'description' => 'required'
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $apartment->title       = $request->title;
        $apartment->description = $request->description;
        $apartment->save();
        
        return response()->json(new ApartmentResource($apartment), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Apartment $apartment)
    {
        $apartment->delete();

        return response()->json(null, 204);
    }
}