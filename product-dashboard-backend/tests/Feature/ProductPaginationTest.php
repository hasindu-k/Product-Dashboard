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

    public function test_products_pagination_rejects_invalid_per_page_values(): void
    {
        $this
            ->getJson('/api/products?per_page=100')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('per_page');
    }
}
