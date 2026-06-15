"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductCreateModal } from "@/components/ProductCreateModal";
import { ProductFilters, type SortOption } from "@/components/ProductFilters";
import { ProductUpdateModal } from "@/components/ProductUpdateModal";
import { getStoredUser, logout, type AuthUser } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";
import {
  filterProducts,
  getProductCategories,
  getProducts,
} from "@/services/productservice";
import { type Product, useProductStore } from "@/store/productstore";

function getUserInitials(user: AuthUser) {
  return user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Home() {
  const { products, setProducts } = useProductStore();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");

      try {
        const products = await getProducts();
        setProducts(products);
      } catch {
        setProductError("Unable to load products from the backend.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [setProducts]);

  const categories = useMemo(() => getProductCategories(products), [products]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
      }),
    [category, maxPrice, minPrice, products, search, sortBy],
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse products, compare prices, and open any item for details.
            </p>
          </div>
          {user ? (
            <div className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {getUserInitials(user)}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button
                type="button"
                className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Create product
            </button>
          </div>
        )}

        <div className="mb-4 grid gap-4 rounded border border-gray-200 p-4">
          <SearchBar value={search} onChange={setSearch} />
          <ProductFilters
            categories={categories}
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            onCategoryChange={setCategory}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onSortChange={setSortBy}
            onClear={clearFilters}
          />
        </div>

        <p className="mb-4 text-sm text-gray-600">
          {isLoadingProducts
            ? "Loading products..."
            : `Showing ${filteredProducts.length} of ${products.length} products`}
        </p>

        {productError && (
          <p
            role="alert"
            className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {productError}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded border border-gray-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/products/${product.id}`} className="block">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full rounded border border-gray-200 object-contain p-4"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  No image
                </div>
              )}

              <h2 className="mt-3 line-clamp-2 font-bold">{product.title}</h2>

              <p className="mt-2 text-sm capitalize text-gray-600">
                {product.category}
              </p>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold">${product.price}</span>
                <span className="text-gray-600">⭐ {product.rating.rate}</span>
              </div>
              </Link>

              {user && (
                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="mt-4 w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Update
                </button>
              )}
            </article>
          ))}
        </div>

        {!isLoadingProducts && filteredProducts.length === 0 && (
          <p className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-600">
            No products match your filters.
          </p>
        )}
      </div>

      {user && (
        <ProductCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProductCreated={(product) => setProducts([product, ...products])}
        />
      )}

      {user && selectedProduct && (
        <ProductUpdateModal
          key={selectedProduct.id}
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </main>
  );
}
