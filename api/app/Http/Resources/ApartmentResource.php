<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApartmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $booking_approved = !is_null($this->bookings) && $this->bookings->filter(function($item) {
            return $item->approved == true;
        })->first();

        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'available'   => !$booking_approved,
            'user'        => new UserResource($this->user),
            'features'    => is_null($this->features) ? null : FeatureResource::collection($this->features),
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
