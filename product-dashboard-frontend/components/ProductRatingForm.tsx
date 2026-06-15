"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredUser, type AuthUser } from "@/lib/auth";
import { getProduct, rateProduct } from "@/services/productservice";
import { type Product } from "@/store/productstore";

interface ProductRatingFormProps {
  product: Product;
}

export function ProductRatingForm({ product }: ProductRatingFormProps) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [selectedRating, setSelectedRating] = useState(
    product.user_rating ?? 0,
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [user] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoadingUserRating, setIsLoadingUserRating] = useState(
    Boolean(user),
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    async function loadUserRating() {
      try {
        const latestProduct = await getProduct(String(product.id));

        if (isCancelled) {
          return;
        }

        setCurrentProduct(latestProduct);
        setSelectedRating(latestProduct.user_rating ?? 0);
      } catch {
        if (!isCancelled) {
          setError("Unable to load your saved rating.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingUserRating(false);
        }
      }
    }

    loadUserRating();

    return () => {
      isCancelled = true;
    };
  }, [product.id, user]);

  const handleRating = async (rating: number) => {
    setSelectedRating(rating);
    setError("");

    if (!user) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedProduct = await rateProduct(currentProduct.id, rating);
      setCurrentProduct(updatedProduct);
      setSelectedRating(updatedProduct.user_rating ?? rating);
    } catch {
      setError("Unable to save your rating. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mt-6 rounded border border-gray-200 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Rating</h2>
          <p className="mt-1 text-sm text-gray-600">
            {currentProduct.rating.rate} out of 5 from{" "}
            {currentProduct.rating.count} reviews
          </p>
          {user && (
            <p className="mt-1 text-sm text-gray-600">
              Your rating:{" "}
              {isLoadingUserRating
                ? "Loading..."
                : selectedRating || "Not rated yet"}
            </p>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                disabled={isSaving || isLoadingUserRating}
                onClick={() => handleRating(rating)}
                className={`h-10 w-10 rounded border text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                  selectedRating >= rating
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={`Rate ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Login to rate
          </Link>
        )}
      </div>

      {isSaving && <p className="mt-3 text-sm text-gray-600">Saving rating...</p>}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </section>
  );
}
