import axios from "axios";
import { type SortOption } from "@/components/ProductFilters";
import { type Product } from "@/store/productstore";

interface LaravelResource<T> {
  data: T;
}

export interface ProductFilterOptions {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const productApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

function unwrapResource<T>(response: T | LaravelResource<T>) {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return response.data;
  }

  return response;
}

export async function getProducts() {
  const { data } = await productApi.get<Product[] | LaravelResource<Product[]>>(
    "/products",
  );

  return unwrapResource(data);
}

export async function getProduct(id: string) {
  const { data } = await productApi.get<Product | LaravelResource<Product>>(
    `/products/${id}`,
  );

  return unwrapResource(data);
}

export function getProductCategories(products: Product[]) {
  return Array.from(new Set(products.map((product) => product.category)));
}

export function filterProducts(
  products: Product[],
  { search, category, minPrice, maxPrice, sortBy }: ProductFilterOptions,
) {
  const query = search.trim().toLowerCase();
  const min = minPrice === "" ? 0 : Number(minPrice);
  const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);

  return products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = category === "all" || product.category === category;
      const matchesPrice = product.price >= min && product.price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .toSorted((first, second) => sortProducts(first, second, sortBy));
}

function sortProducts(first: Product, second: Product, sortBy: SortOption) {
  if (sortBy === "price-asc") {
    return first.price - second.price;
  }

  if (sortBy === "price-desc") {
    return second.price - first.price;
  }

  if (sortBy === "rating-desc") {
    return second.rating.rate - first.rating.rate;
  }

  if (sortBy === "title-asc") {
    return first.title.localeCompare(second.title);
  }

  return first.id - second.id;
}
