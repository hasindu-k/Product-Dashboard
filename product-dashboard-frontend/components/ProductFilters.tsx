export type SortOption =
  | "default"
  | "latest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

interface ProductFiltersProps {
  categories: string[];
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
  onCategoryChange: (category: string) => void;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onClear: () => void;
}

export function ProductFilters({
  categories,
  category,
  minPrice,
  maxPrice,
  sortBy,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onClear,
}: Readonly<ProductFiltersProps>) {
  return (
    <div className="grid gap-3 rounded border border-gray-200 p-4 md:grid-cols-5">
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Category</span>
        <select
          className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Min price</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Max price</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="999"
          className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-medium">Sort</span>
        <select
          className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
        >
          <option value="default">Default</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Top rated</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </label>

      <button
        type="button"
        className="self-end rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  );
}
