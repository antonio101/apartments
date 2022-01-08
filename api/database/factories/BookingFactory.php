<?php

namespace Database\Factories;

use App\Models\Apartment;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $apartments = Apartment::all();
        $apartment  = count($apartments) ? $apartments->random() : Apartment::factory()->create();

        $birthday = $this->faker->dateTimeBetween('-60 years', '-19 years'); // Adult not too old

        return [
            'name'         => $this->faker->name(),
            'birthday'     => $birthday->format('Y-m-d'),
            'apartment_id' => $apartment->id,
        ];
    }
}
