<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateApiKeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('key', 64);
            $table->boolean('active')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('key');
        });

        DB::table('api_keys')->insert([
            'name'       => 'frontend',
            'key'        => 'tX8N9zKCyo6HqATx6i6bBW7OgH6GMxmKQJFv1HX4DuyNFpYzszB616SipnodLprc',
            'active'     => 1,
            'created_at' => Carbon\Carbon::now(),
            'updated_at' => Carbon\Carbon::now(),
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('api_keys');
    }
}
