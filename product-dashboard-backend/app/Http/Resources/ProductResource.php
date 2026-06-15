<?php

namespace App\Http\Resources;

use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userRating = $request->user()
            ? Rating::query()
                ->where('product_id', $this->id)
                ->where('user_id', $request->user()->id)
                ->value('rating')
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'price' => (float) $this->price,
            'description' => $this->description,
            'category' => $this->category,
            'image' => $this->image_url,
            'rating' => [
                'rate' => round((float) ($this->ratings_avg_rating ?? 0), 1),
                'count' => (int) ($this->ratings_count ?? 0),
            ],
            'user_rating' => $userRating ? (int) $userRating : null,
        ];
    }
}
