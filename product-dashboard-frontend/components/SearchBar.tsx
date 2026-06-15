interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Search products..."
      className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
