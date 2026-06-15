<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductRatingTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_show_returns_null_user_rating_for_guests(): void
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/products/{$product->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.user_rating', null);
    }

    public function test_product_show_returns_authenticated_users_rating(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Rating::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 4,
        ]);

        $response = $this
            ->actingAs($user, 'api')
            ->getJson("/api/products/{$product->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.user_rating', 4);
    }

    public function test_authenticated_user_can_rate_a_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this
            ->actingAs($user, 'api')
            ->postJson("/api/products/{$product->id}/rating", [
                'rating' => 5,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.rating.rate', 5)
            ->assertJsonPath('data.rating.count', 1)
            ->assertJsonPath('data.user_rating', 5);

        $this->assertDatabaseHas('ratings', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 5,
        ]);
    }

    public function test_product_rating_average_is_calculated_from_multiple_users(): void
    {
        $users = User::factory()->count(3)->create();
        $product = Product::factory()->create();

        Rating::factory()->create([
            'user_id' => $users[0]->id,
            'product_id' => $product->id,
            'rating' => 2,
        ]);

        Rating::factory()->create([
            'user_id' => $users[1]->id,
            'product_id' => $product->id,
            'rating' => 4,
        ]);

        $response = $this
            ->actingAs($users[2], 'api')
            ->postJson("/api/products/{$product->id}/rating", [
                'rating' => 5,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.rating.rate', 3.7)
            ->assertJsonPath('data.rating.count', 3)
            ->assertJsonPath('data.user_rating', 5);
    }

    public function test_authenticated_user_rating_is_updated_not_duplicated(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        Rating::factory()->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 2,
        ]);

        $response = $this
            ->actingAs($user, 'api')
            ->postJson("/api/products/{$product->id}/rating", [
                'rating' => 4,
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.user_rating', 4);

        $this->assertDatabaseCount('ratings', 1);
        $this->assertDatabaseHas('ratings', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => 4,
        ]);
    }

    public function test_rating_requires_authenticated_user_and_valid_value(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this
            ->postJson("/api/products/{$product->id}/rating", [
                'rating' => 4,
            ])
            ->assertUnauthorized();

        $this
            ->actingAs($user, 'api')
            ->postJson("/api/products/{$product->id}/rating", [
                'rating' => 6,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('rating');
    }
}
