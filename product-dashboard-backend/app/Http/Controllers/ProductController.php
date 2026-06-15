<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProductController extends Controller
{
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
                fn($query) => $query->where('category', $request->string('category')->toString())
            )
            ->when(
                $request->filled('min_price'),
                fn($query) => $query->where('price', '>=', $request->float('min_price'))
            )
            ->when(
                $request->filled('max_price'),
                fn($query) => $query->where('price', '<=', $request->float('max_price'))
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

    public function show(Product $product)
    {
        $product->loadCount('ratings')->loadAvg('ratings', 'rating');

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $imagePath = null;

        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');

                if (! $imagePath) {
                    return $this->response([
                        'message' => 'Unable to upload product image.',
                    ], 500, false);
                }

                $data['image'] = $imagePath;
            }

            $product = Product::create($data);
            $product->loadCount('ratings')->loadAvg('ratings', 'rating');

            return (new ProductResource($product))
                ->response()
                ->setStatusCode(201);
        } catch (Throwable $e) {
            if ($imagePath) {
                rescue(fn() => Storage::disk('public')->delete($imagePath));
            }

            Log::error('Product creation failed.', [
                'image_path' => $imagePath,
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to create product. Please try again.',
            ], 500, false);
        }
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $newImagePath = null;

        try {
            if ($request->hasFile('image')) {
                $newImagePath = $request->file('image')->store('products', 'public');

                if (! $newImagePath) {
                    return $this->response([
                        'message' => 'Unable to upload product image.',
                    ], 500, false);
                }

                $data['image'] = $newImagePath;
            } elseif (array_key_exists('image', $data) && $data['image'] === null && $product->image) {
                $data['image'] = null;
            }

            $oldImagePath = $product->image;
            $shouldDeleteOldImage = $oldImagePath &&
                ! str_starts_with($oldImagePath, 'http://') &&
                ! str_starts_with($oldImagePath, 'https://') &&
                (
                    ($newImagePath && $newImagePath !== $oldImagePath) ||
                    (array_key_exists('image', $data) && $data['image'] === null)
                );

            $product->update($data);

            if ($shouldDeleteOldImage) {
                Storage::disk('public')->delete($oldImagePath);
            }

            return new ProductResource(
                $product->fresh()->loadCount('ratings')->loadAvg('ratings', 'rating')
            );
        } catch (Throwable $e) {
            if ($newImagePath) {
                rescue(fn() => Storage::disk('public')->delete($newImagePath));
            }

            Log::error('Product update failed.', [
                'product_id' => $product->id,
                'new_image_path' => $newImagePath,
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to update product. Please try again.',
            ], 500, false);
        }
    }

    public function destroy(Product $product)
    {
        try {
            if (
                $product->image &&
                ! str_starts_with($product->image, 'http://') &&
                ! str_starts_with($product->image, 'https://')
            ) {
                Storage::disk('public')->delete($product->image);
            }

            $product->delete();

            return $this->response([
                'message' => 'Product deleted successfully.',
            ]);
        } catch (Throwable $e) {
            Log::error('Product deletion failed.', [
                'product_id' => $product->id,
                'image_path' => $product->image,
                'exception' => $e,
            ]);

            return $this->response([
                'message' => 'Unable to delete product. Please try again.',
            ], 500, false);
        }
    }
}
