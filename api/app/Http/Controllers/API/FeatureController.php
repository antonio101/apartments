<?php

namespace App\Http\Controllers\API;

use App\Models\Feature;
use App\Http\Controllers\Controller;
use App\Http\Resources\FeatureResource;

class FeatureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Feature::latest()->get();
        return response()->json(FeatureResource::collection($data));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $feature = Feature::find($id);

        if (is_null($feature)) {
            return response()->json(null, 404); 
        }

        return response()->json(new FeatureResource($feature), 200);
    }
}