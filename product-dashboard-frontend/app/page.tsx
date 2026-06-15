"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ProductFilters, type SortOption } from "@/components/ProductFilters";
import { SearchBar } from "@/components/SearchBar";
import {
  filterProducts,
  getProductCategories,
} from "@/services/productservice";
import { type Product, useProductStore } from "@/store/productstore";

export default function Home() {
  const { products, setProducts } = useProductStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    axios
      .get<Product[]>("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data));
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

  return (
    <main className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Product Dashboard</h1>

      <div className="mb-4 grid gap-4">
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
        Showing {filteredProducts.length} of {products.length} products
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="rounded border border-gray-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-48 w-full object-contain"
            />

            <h2 className="mt-3 line-clamp-2 font-bold">{product.title}</h2>

            <p className="mt-2 text-sm capitalize text-gray-600">
              {product.category}
            </p>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold">${product.price}</span>
              <span>⭐ {product.rating.rate}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-600">
          No products match your filters.
        </p>
      )}
    </main>
  );
}
