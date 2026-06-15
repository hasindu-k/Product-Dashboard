<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'id' => 1,
                'title' => 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                'price' => 109.95,
                'description' => 'Your perfect pack for everyday use and walks in the forest. Stash your laptop in the padded sleeve, your everyday items in the main compartment, and keep small items close at hand.',
                'category' => "men's clothing",
                'image' => 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
            ],
            [
                'id' => 2,
                'title' => 'Mens Casual Premium Slim Fit T-Shirts',
                'price' => 22.30,
                'description' => 'Slim-fitting casual shirt made with soft, lightweight cotton for comfortable everyday wear.',
                'category' => "men's clothing",
                'image' => 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
            ],
            [
                'id' => 3,
                'title' => 'Mens Cotton Jacket',
                'price' => 55.99,
                'description' => 'A practical cotton jacket suitable for spring, autumn, outdoor activities, travel, and casual daily use.',
                'category' => "men's clothing",
                'image' => 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png',
            ],
            [
                'id' => 4,
                'title' => 'Mens Casual Slim Fit',
                'price' => 15.99,
                'description' => 'Casual slim-fit shirt with a clean look for relaxed daily outfits.',
                'category' => "men's clothing",
                'image' => 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png',
            ],
            [
                'id' => 5,
                'title' => "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                'price' => 695.00,
                'description' => 'Inspired by the mythical water dragon, this chain bracelet blends gold and silver tones for a bold jewelry statement.',
                'category' => 'jewelery',
                'image' => 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
            ],
            [
                'id' => 6,
                'title' => 'Solid Gold Petite Micropave',
                'price' => 168.00,
                'description' => 'Petite micropave jewelry designed for simple, elegant styling.',
                'category' => 'jewelery',
                'image' => 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png',
            ],
            [
                'id' => 7,
                'title' => 'White Gold Plated Princess',
                'price' => 9.99,
                'description' => 'Classic princess-style ring with white gold plating for a refined everyday accessory.',
                'category' => 'jewelery',
                'image' => 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png',
            ],
            [
                'id' => 8,
                'title' => 'Pierced Owl Rose Gold Plated Stainless Steel Double',
                'price' => 10.99,
                'description' => 'Rose gold plated stainless steel earrings with a double-flared tunnel design.',
                'category' => 'jewelery',
                'image' => 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png',
            ],
            [
                'id' => 9,
                'title' => 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
                'price' => 64.00,
                'description' => 'Portable external hard drive with USB 3.0 connectivity for simple storage expansion.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png',
            ],
            [
                'id' => 10,
                'title' => 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
                'price' => 109.00,
                'description' => 'Internal SATA SSD built to improve boot-up, shutdown, and application response times.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png',
            ],
            [
                'id' => 11,
                'title' => 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost',
                'price' => 109.00,
                'description' => 'Compact solid state drive with SLC cache technology for improved transfer performance.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png',
            ],
            [
                'id' => 12,
                'title' => 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
                'price' => 114.00,
                'description' => 'High-capacity portable gaming drive designed to expand console storage.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png',
            ],
            [
                'id' => 13,
                'title' => 'Acer SB220Q bi 21.5 inches Full HD IPS Ultra-Thin',
                'price' => 599.00,
                'description' => 'Ultra-thin Full HD IPS monitor with a compact design for everyday productivity.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png',
            ],
            [
                'id' => 14,
                'title' => 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor',
                'price' => 999.99,
                'description' => 'Large curved gaming monitor with a high refresh rate and immersive ultrawide display.',
                'category' => 'electronics',
                'image' => 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png',
            ],
            [
                'id' => 15,
                'title' => "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
                'price' => 56.99,
                'description' => 'Warm 3-in-1 winter jacket suitable for snowboarding, skiing, and cold-weather wear.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png',
            ],
            [
                'id' => 16,
                'title' => "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
                'price' => 29.95,
                'description' => 'Faux leather moto jacket with a removable hood and a comfortable modern fit.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png',
            ],
            [
                'id' => 17,
                'title' => 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
                'price' => 39.99,
                'description' => 'Lightweight striped rain jacket and windbreaker for travel, hiking, and everyday use.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2_t.png',
            ],
            [
                'id' => 18,
                'title' => "MBJ Women's Solid Short Sleeve Boat Neck V",
                'price' => 9.85,
                'description' => 'Soft short-sleeve top with a simple boat neck style for casual outfits.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png',
            ],
            [
                'id' => 19,
                'title' => "Opna Women's Short Sleeve Moisture",
                'price' => 7.95,
                'description' => 'Moisture-wicking short sleeve shirt made for active comfort.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png',
            ],
            [
                'id' => 20,
                'title' => 'DANVOUY Womens T Shirt Casual Cotton Short',
                'price' => 12.99,
                'description' => 'Casual cotton short sleeve T-shirt with a relaxed fit for everyday wear.',
                'category' => "women's clothing",
                'image' => 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png',
            ],
        ];

        foreach ($products as $product) {
            $id = $product['id'];
            unset($product['id']);

            Product::query()->updateOrCreate(
                ['id' => $id],
                $product,
            );
        }

        $users = collect(range(1, 5))->map(
            fn (int $number) => User::query()->updateOrCreate(
                ['email' => "reviewer{$number}@example.com"],
                [
                    'name' => "Reviewer {$number}",
                    'password' => 'password',
                ],
            )
        );

        $ratings = [
            1 => [4, 4, 4, 4, 3],
            2 => [4, 4, 4, 3, 3],
            3 => [5, 5, 5, 4, 4],
            4 => [3, 3, 3, 2, 2],
            5 => [5, 5, 4, 4, 4],
            6 => [4, 4, 4, 4, 3],
            7 => [4, 4, 3, 3, 3],
            8 => [2, 2, 2, 2, 2],
            9 => [4, 4, 4, 4, 3],
            10 => [3, 3, 3, 3, 3],
            11 => [5, 5, 5, 4, 4],
            12 => [5, 4, 4, 4, 4],
            13 => [3, 3, 3, 2, 2],
            14 => [3, 3, 3, 2, 2],
            15 => [3, 3, 3, 3, 3],
            16 => [3, 3, 3, 2, 2],
            17 => [4, 4, 4, 4, 3],
            18 => [5, 4, 4, 4, 4],
            19 => [5, 5, 5, 4, 4],
            20 => [4, 4, 4, 4, 3],
        ];

        foreach ($ratings as $productId => $productRatings) {
            foreach ($productRatings as $index => $rating) {
                Rating::query()->updateOrCreate(
                    [
                        'user_id' => $users[$index]->id,
                        'product_id' => $productId,
                    ],
                    [
                        'rating' => $rating,
                    ],
                );
            }
        }
    }
}
