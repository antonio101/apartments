<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Horizon\Horizon;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Horizon::auth(function ($request) {
            // Always show admin if local development
            if (env('APP_ENV') == 'local') {
                return true;
            }
        });
    }

    public function register()
    {
        //
    }
}