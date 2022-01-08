<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\Notifier\BookingNotifier;
use Illuminate\Support\Facades\Redis;

class SendBookingRequestNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $notifier;

	public function __construct(BookingNotifier $notifier)
    {
        $this->notifier = $notifier;
    }

	public function handle()
	{

        // Allow only 20 notifications every 1 second
        Redis::throttle('notification')->allow(20)->every(1)->then(function () {

            $this->notifier->send();

        }, function () {
            // Could not obtain lock; this job will be re-queued
            return $this->release(2);
        });

	}
}