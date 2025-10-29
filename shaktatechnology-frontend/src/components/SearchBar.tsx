"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query.trim());
    }, 300);
    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
    <div className="flex items-center gap-2 w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
