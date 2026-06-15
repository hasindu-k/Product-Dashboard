<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_are_paginated(): void
    {
        Product::factory()->count(12)->create();

        $response = $this->getJson('/api/products?per_page=5&page=2');

        $response
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.total', 12)
            ->assertJsonPath('meta.last_page', 3);
    }

    public function test_products_are_sorted_by_updated_at_descending_by_default(): void
    {
        $oldest = Product::factory()->create([
            'updated_at' => now()->subDays(2),
        ]);
        $newest = Product::factory()->create([
            'updated_at' => now(),
        ]);
        $middle = Product::factory()->create([
            'updated_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/products?per_page=3');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.id', $newest->id)
            ->assertJsonPath('data.1.id', $middle->id)
            ->assertJsonPath('data.2.id', $oldest->id);
    }

    public function test_products_can_be_sorted_by_latest_and_oldest(): void
    {
        $oldest = Product::factory()->create([
            'updated_at' => now()->subDays(2),
        ]);
        $newest = Product::factory()->create([
            'updated_at' => now(),
        ]);
        $middle = Product::factory()->create([
            'updated_at' => now()->subDay(),
        ]);

        $this
            ->getJson('/api/products?per_page=3&sort_by=latest')
            ->assertOk()
            ->assertJsonPath('data.0.id', $newest->id)
            ->assertJsonPath('data.1.id', $middle->id)
            ->assertJsonPath('data.2.id', $oldest->id);

        $this
            ->getJson('/api/products?per_page=3&sort_by=oldest')
            ->assertOk()
            ->assertJsonPath('data.0.id', $oldest->id)
            ->assertJsonPath('data.1.id', $middle->id)
            ->assertJsonPath('data.2.id', $newest->id);
    }

    public function test_products_can_be_searched_filtered_and_sorted(): void
    {
        $headphones = Product::factory()->create([
            'title' => 'Wireless Headphones',
            'category' => 'electronics',
            'description' => 'Noise cancelling audio',
            'price' => 150,
        ]);
        $speaker = Product::factory()->create([
            'title' => 'Wireless Speaker',
            'category' => 'electronics',
            'description' => 'Portable room audio',
            'price' => 250,
        ]);
        Product::factory()->create([
            'title' => 'Wireless Keyboard',
            'category' => 'electronics',
            'price' => 80,
        ]);
        Product::factory()->create([
            'title' => 'Office Chair',
            'category' => 'furniture',
            'description' => 'Wireless does not match the category filter',
            'price' => 220,
        ]);

        $response = $this->getJson(
            '/api/products?search=wireless&category=electronics&min_price=100&max_price=300&sort_by=price-desc'
        );

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $speaker->id)
            ->assertJsonPath('data.1.id', $headphones->id);
    }

    public function test_product_categories_are_returned_for_filters(): void
    {
        Product::factory()->create(['category' => 'electronics']);
        Product::factory()->create(['category' => 'furniture']);
        Product::factory()->create(['category' => 'electronics']);

        $response = $this->getJson('/api/products/categories');

        $response
            ->assertOk()
            ->assertJsonPath('data', ['electronics', 'furniture']);
    }

    public function test_products_pagination_rejects_invalid_per_page_values(): void
    {
        $this
            ->getJson('/api/products?per_page=100')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('per_page');
    }
}
