<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(10)->create();

        $features = \App\Models\Feature::all();

        \App\Models\Apartment::factory(10)->create()->each(function($user) use ($features) {
            $user->features()->attach(
                $features->random(rand(1, count($features)))->pluck('id')->toArray()
            ); 
        });
    }
}
