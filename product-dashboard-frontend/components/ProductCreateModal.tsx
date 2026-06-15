"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createProduct, getApiErrorMessage } from "@/services/productservice";
import { type Product } from "@/store/productstore";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

export function ProductCreateModal({
  isOpen,
  onClose,
  onProductCreated,
}: ProductCreateModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const imagePreviewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewRef.current) {
        URL.revokeObjectURL(imagePreviewRef.current);
      }
    };
  }, []);

  const handleImageChange = (file: File | null) => {
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
    }

    setImage(file);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    imagePreviewRef.current = previewUrl;
    setImagePreview(previewUrl);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isCreating) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCreating, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setPrice("");
    handleImageChange(null);
    setImageInputKey((key) => key + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !category.trim() || !price.trim()) {
      setError("Title, category, and price are required.");
      return;
    }

    setIsCreating(true);

    try {
      const product = await createProduct({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        price,
        image,
      });

      onProductCreated(product);
      resetForm();
      onClose();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Unable to create product. Please check the details.",
        ),
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-product-title"
    >
      <div className="w-full max-w-2xl rounded border border-gray-200 bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="create-product-title" className="text-lg font-semibold">
              Create product
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Add a product to the backend catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
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
                alt={title || "Selected product image"}
                className="h-40 w-full rounded border border-gray-200 object-contain p-3"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                No image selected
              </div>
            )}

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Image</span>
              <input
                key={imageInputKey}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isCreating}
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0] ?? null)
                }
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
                disabled={isCreating}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="font-medium">Category</span>
              <input
                type="text"
                value={category}
                disabled={isCreating}
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
                disabled={isCreating}
                onChange={(event) => setPrice(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-medium">Description</span>
            <textarea
              value={description}
              disabled={isCreating}
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
              disabled={isCreating}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isCreating ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
