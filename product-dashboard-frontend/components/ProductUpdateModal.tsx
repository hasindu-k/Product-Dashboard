"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { getApiErrorMessage, updateProduct } from "@/services/productservice";
import { type Product } from "@/store/productstore";

interface ProductUpdateModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (product: Product) => void;
}

export function ProductUpdateModal({
  product,
  isOpen,
  onClose,
  onProductUpdated,
}: ProductUpdateModalProps) {
  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [image, setImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const selectedImagePreviewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (selectedImagePreviewRef.current) {
        URL.revokeObjectURL(selectedImagePreviewRef.current);
      }
    };
  }, []);

  const imagePreview = selectedImagePreview ?? product.image;

  const handleImageChange = (file: File | null) => {
    if (selectedImagePreviewRef.current) {
      URL.revokeObjectURL(selectedImagePreviewRef.current);
      selectedImagePreviewRef.current = null;
    }

    setImage(file);

    if (!file) {
      setSelectedImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    selectedImagePreviewRef.current = previewUrl;
    setSelectedImagePreview(previewUrl);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUpdating) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isUpdating, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !category.trim() || !price.trim()) {
      setError("Title, category, and price are required.");
      return;
    }

    setIsUpdating(true);

    try {
      const updatedProduct = await updateProduct({
        id: product.id,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        price,
        image,
      });

      onProductUpdated(updatedProduct);
      onClose();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to update product. Please check the details.",
        ),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-product-title"
    >
      <div className="w-full max-w-2xl rounded border border-gray-200 bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="update-product-title" className="text-lg font-semibold">
              Update product
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Edit the product details in the backend catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={title || product.title}
                className="h-40 w-full rounded border border-gray-200 object-contain p-3"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                No image
              </div>
            )}

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Replace image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUpdating}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  handleImageChange(file);
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Title</span>
              <input
                type="text"
                value={title}
                disabled={isUpdating}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Category</span>
              <input
                type="text"
                value={category}
                disabled={isUpdating}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                disabled={isUpdating}
                onChange={(event) => setPrice(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">Description</span>
            <textarea
              value={description}
              disabled={isUpdating}
              rows={3}
              onChange={(event) => setDescription(event.target.value)}
              className="resize-y rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isUpdating ? "Updating..." : "Update product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
