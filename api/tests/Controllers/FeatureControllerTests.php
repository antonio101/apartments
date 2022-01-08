<?php
    
namespace Tests\Controllers;

use App\Models\Feature;
use Illuminate\Http\Response;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
    
class FeatureControllerTests extends TestCase {
    
    use WithoutMiddleware;

    public function setUp(): void {
    
        parent::setUp();

        $this->withHeaders([
            'Accept' => 'application/json'
        ]);

    }
    
    public function testIndexReturnsDataInValidFormat() {

        $this->json('get', 'api/features')
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                ]
            ]);
    }
    
    public function testFeatureIsShownCorrectly() {
        $feature = Feature::factory()->create();
    
        $this->json('get', "api/features/$feature->id")
            ->assertStatus(Response::HTTP_OK)
            ->assertExactJson([
                'id'          => $feature->id,
                'name'        => $feature->name,
                'created_at'  => $feature->created_at->jsonSerialize(),
                'updated_at'  => $feature->updated_at->jsonSerialize()
            ]);
    }
}