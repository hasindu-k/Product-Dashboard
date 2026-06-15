<?php

namespace App\Http\Resources;

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
        ];
    }
}
