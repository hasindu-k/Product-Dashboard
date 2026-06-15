import axios from "axios";
import { type SortOption } from "@/components/ProductFilters";
import { type Product } from "@/store/productstore";

interface LaravelResource<T> {
  data: T;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

interface LaravelPaginatedResource<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateProductPayload {
  title: string;
  category: string;
  description: string;
  price: string;
  image?: File | null;
}

export interface UpdateProductPayload extends CreateProductPayload {
  id: number;
}

export interface ProductPaginationOptions {
  page: number;
  perPage: number;
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const AUTH_TOKEN_KEY = "product_dashboard_token";

const productApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

productApi.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function unwrapResource<T>(response: T | LaravelResource<T>) {
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }

  return response;
}

export async function getProducts({
  page,
  perPage,
  search,
  category,
  minPrice,
  maxPrice,
  sortBy,
}: ProductPaginationOptions) {
  const { data } = await productApi.get<LaravelPaginatedResource<Product>>(
    "/products",
    {
      params: {
        page,
        per_page: perPage,
        search: search.trim() || undefined,
        category: category === "all" ? undefined : category,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        sort_by: sortBy,
      },
    },
  );

  return data;
}

export async function getProductCategories() {
  const { data } = await productApi.get<LaravelResource<string[]>>(
    "/products/categories",
  );

  return unwrapResource(data);
}

export async function getProduct(id: string) {
  const { data } = await productApi.get<Product | LaravelResource<Product>>(
    `/products/${id}`,
  );

  return unwrapResource(data);
}

export async function createProduct(payload: CreateProductPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("price", payload.price);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const { data } = await productApi.post<Product | LaravelResource<Product>>(
    "/products",
    formData,
  );

  return unwrapResource(data);
}

export async function updateProduct(payload: UpdateProductPayload) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("price", payload.price);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const { data } = await productApi.post<Product | LaravelResource<Product>>(
    `/products/${payload.id}`,
    formData,
  );

  return unwrapResource(data);
}

export async function rateProduct(productId: number, rating: number) {
  const { data } = await productApi.post<Product | LaravelResource<Product>>(
    `/products/${productId}/rating`,
    { rating },
  );

  return unwrapResource(data);
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed. Please try again.",
) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const data = error.response?.data;
  const validationMessages = data?.errors
    ? Object.values(data.errors).flat()
    : [];

  if (validationMessages.length > 0) {
    return validationMessages.join(" ");
  }

  return data?.message ?? fallback;
}
