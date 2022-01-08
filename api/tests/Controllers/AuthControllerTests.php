<?php
    
namespace Tests\Controllers;

use App\Models\User;
use Illuminate\Http\Response;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
    
class AuthControllerTests extends TestCase {
    
    use WithoutMiddleware;

    public function setUp(): void {
    
        parent::setUp();

        $this->withHeaders([
            'Accept' => 'application/json'
        ]);

    }
    
    public function testUserRegister() {

        $payload = [
            'name'     => $this->faker->name(),
            'email'    => $this->faker->unique()->safeEmail(),
            'password' => $this->faker->password(),
        ];
        
        $this->postJson('api/register', $payload)
            ->assertStatus(Response::HTTP_CREATED)
            ->assertJsonStructure([
                'data' => [
                    'name',
                    'email',
                    'updated_at',
                    'created_at',
                    'id'
                ],
                'access_token',
                'token_type'
            ]);

        unset($payload['password']);

        $this->assertDatabaseHas('users', $payload);
    }
    
    public function testUserRegisterWithMissingData() {

        $payload = [
            'email'    => $this->faker->unique()->safeEmail(),
            'password' => $this->faker->password(),
        ];
        
        $this->postJson('api/register', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonStructure(['errors']);
    }

    /*//+////public function testUserRegisterBeingConnected() {
        $user = User::factory()->create();
        $payload = User::factory()->definition();
        
        $this->actingAs($user)->post('api/register', $payload)
            ->assertStatus(Response::HTTP_BAD_REQUEST);
    }*/

    public function testLogin() {

        $payload = [
            'name'     => $this->faker->name(),
            'email'    => $this->faker->unique()->safeEmail(),
            'password' => $this->faker->regexify('.{20}')
        ];
        
        $this->postJson('api/register', $payload)
            ->assertStatus(Response::HTTP_CREATED);

        unset($payload['name']);
        
        $this->postJson('api/login', $payload)
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'access_token',
                'token_type'
            ])
            ->assertJsonPath('token_type', 'Bearer');
    }

    public function testLogout() {
        $user = User::factory()->create();
        
        $this->actingAs($user)->post('api/logout')
            ->assertStatus(Response::HTTP_OK);
    }

    public function testLogoutNotBeingConnected() {

        $this->postJson('api/logout')
            ->assertStatus(Response::HTTP_BAD_REQUEST)
            ->assertJsonStructure(['error']);
    }
}