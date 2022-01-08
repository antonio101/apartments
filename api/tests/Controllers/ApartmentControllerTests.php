<?php
    
namespace Tests\Controllers;

use App\Models\Apartment;
use App\Models\User;
use Illuminate\Http\Response;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
    
class ApartmentControllerTests extends TestCase {
    
    use WithoutMiddleware;

    public function setUp(): void {
    
        parent::setUp();

        $this->withHeaders([
            'Accept' => 'application/json'
        ]);
        
    }
    
    public function testIndexReturnsDataInValidFormat() {

        $this->json('get', 'api/apartments')
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'description',
                    'available',
                    'user',
                    'features',
                    'created_at',
                    'updated_at',
                ]
            ]);
    }
    
    public function testApartmentIsCreatedSuccessfully() {
        $user = User::factory()->create();

        $payload = [
            'title'       => $this->faker->text(100),
            'description' => $this->faker->text(300),
        ];
        
        $this->actingAs($user)->post('api/apartments', $payload)
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJsonStructure([
                'id',
                'description',
                'available',
                'user',
                'features',
                'created_at',
                'updated_at',
            ]);
        $this->assertDatabaseHas('apartments', $payload);
    }
    
    public function testStoreWithMissingData() {
        $user = User::factory()->create();

        $payload = [
            'description' => $this->faker->text(300),
        ];
        
        $this->actingAs($user)->post('api/apartments', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonStructure(['errors']);
    }
    
    public function testStoreAunauthenticated() {
        $payload = Apartment::factory()->definition();
        
        $this->json('post', 'api/apartments', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonStructure(['error']);
    }
    
    
    public function testApartmentIsShownCorrectly() {
        $apartment = Apartment::factory()->create();
    
        $this->json('get', "api/apartments/$apartment->id")
            ->assertStatus(Response::HTTP_OK)
            ->assertExactJson([
                'id'          => $apartment->id,
                'title'       => $apartment->title,
                'description' => $apartment->description,
                'available'   => true,
                'user'        => [
                    'id'   => $apartment->user->id,
                    'name' => $apartment->user->name,
                ],
                'features'    => $apartment->features,
                'created_at'  => $apartment->created_at->jsonSerialize(),
                'updated_at'  => $apartment->updated_at->jsonSerialize()
            ]);
    }
    
    public function testShowMissingApartment() {

        $this->json('get', "api/apartments/0")
            ->assertStatus(Response::HTTP_NOT_FOUND)
            ->assertJsonStructure([]);
    }
    
    public function testDestroyApartment() {
        $apartment = Apartment::factory()->create();
    
        $this->call('delete', "api/apartments/$apartment->id")
            ->assertStatus(Response::HTTP_METHOD_NOT_ALLOWED)
            ->assertJsonStructure(['error']);
    }
    
    public function testUpdateApartment() {
        $apartment = Apartment::factory()->create();
    
        $this->call('update', "api/apartments/$apartment->id")
            ->assertStatus(Response::HTTP_METHOD_NOT_ALLOWED)
            ->assertJsonStructure(['error']);
    }
}