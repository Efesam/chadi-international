import { Search } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 focus:border-chadi-green focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;
