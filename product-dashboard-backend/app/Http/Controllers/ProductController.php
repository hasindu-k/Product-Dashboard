<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'nullable', 'string', 'max:255'],
            'min_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'sort_by' => ['sometimes', 'string', 'in:default,latest,oldest,price-asc,price-desc,rating-desc,title-asc'],
        ]);

        $perPage = $request->integer('per_page', 9);
        $sortBy = $request->string('sort_by', 'default')->toString();

        $query = Product::withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(
                $request->filled('category') && $request->string('category')->toString() !== 'all',
                fn ($query) => $query->where('category', $request->string('category')->toString())
            )
            ->when(
                $request->filled('min_price'),
                fn ($query) => $query->where('price', '>=', $request->float('min_price'))
            )
            ->when(
                $request->filled('max_price'),
                fn ($query) => $query->where('price', '<=', $request->float('max_price'))
            );

        match ($sortBy) {
            'latest' => $query->latest('updated_at'),
            'oldest' => $query->oldest('updated_at'),
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'rating-desc' => $query->orderByDesc('ratings_avg_rating'),
            'title-asc' => $query->orderBy('title'),
            default => $query->latest('updated_at'),
        };

        $products = $query
            ->paginate($perPage)
            ->withQueryString();

        return ProductResource::collection($products);
    }

    public function categories()
    {
        return $this->response([
            'data' => Product::query()
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->loadCount('ratings')->loadAvg('ratings', 'rating');

        return new ProductResource($product);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);
        $product->loadCount('ratings')->loadAvg('ratings', 'rating');

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $data['image'] = $request->file('image')->store('products', 'public');
        } elseif (array_key_exists('image', $data) && $data['image'] === null && $product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->update($data);

        return new ProductResource(
            $product->fresh()->loadCount('ratings')->loadAvg('ratings', 'rating')
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return $this->response([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
