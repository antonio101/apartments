<?php
    
namespace Tests\Controllers;

use App\Models\Apartment;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Response;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
    
class BookingControllerTests extends TestCase {
    
    use WithoutMiddleware;

    public function setUp(): void {
    
        parent::setUp();

        $this->withHeaders([
            'Accept' => 'application/json'
        ]);

    }
    
    /*//+//public function testIndexReturnsDataInValidFormat() {

        $this->json('get', 'api/bookings')
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'birthday',
                    'approved',
                    'apartment_id',
                    'created_at',
                    'updated_at',
                ]
            ]);
    }*/
    
    public function testBookingsAreShownSuccessfully() {
        $booking = Booking::factory()->create();
        
        $this->actingAs($booking->apartment->user)->get('api/bookings')
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'birthday',
                    'approved',
                    'apartment_id',
                    'created_at',
                    'updated_at',
                ]
            ]);
    }
    
    public function testBookingIsCreatedSuccessfully() {
        $apartment = Apartment::factory()->create();

        $birthday = $this->faker->dateTimeBetween('-60 years', '-19 years'); // Adult not too old

        $payload = [
            'name'         => $this->faker->name(),
            'birthday'     => $birthday->format('Y-m-d'),
            'apartment_id' => $apartment->id,
        ];
        
        $this->json('post', 'api/bookings', $payload)
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJsonStructure([
                'id',
                'name',
                'birthday',
                'approved',
                'apartment_id',
                'created_at',
                'updated_at',
            ]);
        $this->assertDatabaseHas('bookings', $payload);
    }
    
    public function testStoreWithMissingData() {
        $user = User::factory()->create();
    
        $payload = [
            'name' => $this->faker->name(),
        ];

        $this->actingAs($user)->post('api/bookings', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonStructure(['errors']);
    }
    
    public function testStoreOwnApartment() {
        $apartment = Apartment::factory()->create();
        $payload   = Booking::factory()->definition();

        $payload['apartment_id'] = $apartment->id;

        $this->actingAs($apartment->user)->post('api/bookings', $payload)
            ->assertStatus(Response::HTTP_FORBIDDEN)
            ->assertJsonStructure(['error']);
    }

    
    public function testConfirmBooking() {
        $booking = Booking::factory()->create();

        $payload  = [
            'approved' => true,
        ];

        $this->actingAs($booking->apartment->user)->put('api/bookings/' . $booking->id, $payload)
            ->assertStatus(Response::HTTP_OK)
            ->assertExactJson([
                'id'           => $booking->id,
                'name'         => $booking->name,
                'birthday'     => $booking->birthday,
                'approved'     => true,
                'apartment_id' => $booking->apartment->id,
                'created_at'   => $booking->created_at->jsonSerialize(),
                'updated_at'   => $booking->updated_at->jsonSerialize()
            ]);
    }
    
    public function testErrorWhenBookingRequestOnApprovedApartment() {

        $approved_payload  = [
            'approved' => true,
        ];

        // Step 1: Create a booking request
        $booking = Booking::factory()->create();

        // Step 2: Approve booking
        $this->actingAs($booking->apartment->user)->put('api/bookings/' . $booking->id, $approved_payload)
            ->assertStatus(Response::HTTP_OK);

        // Step 3: Ask for another booking request (must faill)
        $birthday = $this->faker->dateTimeBetween('-60 years', '-19 years'); // Adult not too old

        $payload  = [
            'name'         => $this->faker->name(),
            'birthday'     => $birthday->format('Y-m-d'),
            'apartment_id' => $booking->apartment->id,
        ];

        $user = User::factory()->create();
        
        $this->actingAs($user)->post('api/bookings', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST);
    }

    public function testErrorWhenApproveBookingOnApprovedApartment() {

        $approved_payload  = [
            'approved' => true,
        ];

        // Step 1: Create a booking request
        $booking = Booking::factory()->create();

        // Step 2: Create another booking request for the same apartment
        $birthday = $this->faker->dateTimeBetween('-60 years', '-19 years'); // Adult not too old

        $payload  = [
            'name'         => $this->faker->name(),
            'birthday'     => $birthday->format('Y-m-d'),
            'apartment_id' => $booking->apartment->id,
        ];

        $user = User::factory()->create();
        
        $this->actingAs($user)->post('api/bookings', $payload)
            ->assertStatus(Response::HTTP_CREATED);
        
        $second_booking = Booking::latest()->first();

        // Step 3: Approve first booking
        $this->actingAs($booking->apartment->user)->put('api/bookings/' . $booking->id, $approved_payload)
            ->assertStatus(Response::HTTP_OK);

        // Step 4: Approve second booking (must fail)
        $this->actingAs($booking->apartment->user)->put('api/bookings/' . $second_booking->id, $approved_payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST);
    }
    
    
    public function testBookingIsShownCorrectly() {
        $booking = Booking::factory()->create();
    
        $this->json('get', "api/bookings/$booking->id")
            ->assertStatus(Response::HTTP_OK)
            ->assertExactJson([
                'id'           => $booking->id,
                'name'         => $booking->name,
                'birthday'     => $booking->birthday,
                'approved'     => $booking->approved,
                'apartment_id' => $booking->apartment_id,
                'created_at'   => $booking->created_at->jsonSerialize(),
                'updated_at'   => $booking->updated_at->jsonSerialize()
            ]);
    }
    
    public function testShowMissingBooking() {

        $this->json('get', "api/bookings/0")
            ->assertStatus(Response::HTTP_NOT_FOUND)
            ->assertJsonStructure([]);
    }
    
    public function testDestroyBooking() {
        $booking = Booking::factory()->create();
    
        $this->call('delete', "api/bookings/$booking->id")
            ->assertStatus(Response::HTTP_METHOD_NOT_ALLOWED)
            ->assertJsonStructure(['error']);
    }
    
    public function testUpdateBooking() {
        $booking = Booking::factory()->create();
    
        $this->call('update', "api/bookings/$booking->id")
            ->assertStatus(Response::HTTP_METHOD_NOT_ALLOWED)
            ->assertJsonStructure(['error']);
    }
}