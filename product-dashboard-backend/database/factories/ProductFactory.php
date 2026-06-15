<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'electronics',
            'jewelery',
            "men's clothing",
            "women's clothing",
        ];

        return [
            'title' => fake()->words(4, true),
            'category' => fake()->randomElement($categories),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 5, 999),
            'image' => fake()->imageUrl(640, 480, 'products', true),
        ];
    }
}
