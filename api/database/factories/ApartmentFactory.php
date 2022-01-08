<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApartmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $users = User::all();
        $user  = count($users) ? $users->random() : User::factory()->create();

        return [
            'title'       => $this->faker->text(100),
            'description' => $this->faker->text(300),
            'user_id'     => $user->id
        ];
    }
}
