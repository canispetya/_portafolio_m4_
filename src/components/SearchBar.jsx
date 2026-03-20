import { useState, useRef, useCallback } from 'react';

export default function SearchBar({ onSearch, onFilter, onClear, isSearching }) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    onFilter(val);

    if (!val.trim()) {
      onClear();
      return;
    }
  }, [onFilter, onClear]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && query.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
  }, [onClear]);

  return (
    <div className="relative w-full max-w-md group">
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar Pokémon... (Enter para buscar)"
        className="w-full pl-12 pr-12 py-3 bg-gray-800/80 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(0,200,255,0.3)] focus:bg-gray-800 text-sm font-['Inter']"
      />

      {/* Loading spinner or clear button */}
      {isSearching ? (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : query ? (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
