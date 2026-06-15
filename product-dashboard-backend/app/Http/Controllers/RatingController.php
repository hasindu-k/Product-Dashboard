<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        Rating::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
            ],
            [
                'rating' => $data['rating'],
            ],
        );

        return new ProductResource(
            $product->fresh()->loadCount('ratings')->loadAvg('ratings', 'rating')
        );
    }

    public function destroy(Request $request, Product $product)
    {
        Rating::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return new ProductResource(
            $product->fresh()->loadCount('ratings')->loadAvg('ratings', 'rating')
        );
    }
}
