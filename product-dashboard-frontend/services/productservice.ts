import { type SortOption } from "@/components/ProductFilters";
import { type Product } from "@/store/productstore";

export interface ProductFilterOptions {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
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
