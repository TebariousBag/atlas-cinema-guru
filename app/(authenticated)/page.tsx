"use client";

import { useState, useEffect } from "react";
import { UsersTitle } from "@/lib/definitions";

export default function HomePage() {
  const [titles, setTitles] = useState<UsersTitle[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch available genres
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // Fetch titles based on filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchQuery) params.set("query", searchQuery);
    if (minYear) params.set("minYear", minYear);
    if (maxYear) params.set("maxYear", maxYear);
    if (selectedGenres.length > 0)
      params.set("genres", selectedGenres.join(","));

    fetch(`/api/titles?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTitles(data.title || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [searchQuery, minYear, maxYear, selectedGenres, page]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setPage(1); // Reset to page 1 when filters change
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleMinYearChange = (value: string) => {
    setMinYear(value);
    setPage(1);
  };

  const handleMaxYearChange = (value: string) => {
    setMaxYear(value);
    setPage(1);
  };

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="mb-6 space-y-4 rounded-lg bg-white/5 p-4">
        {/* Top Row: Search/Years on left, Genres on right */}
        <div className="flex gap-6">
          {/* Left Side: Search and Year Filters */}
          <div className="flex-1 space-y-4">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Movies..."
                className="w-full rounded-full text-sm border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
              />
            </div>

            {/* Year Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Min Year
                </label>
                <input
                  type="number"
                  value={minYear}
                  onChange={(e) => handleMinYearChange(e.target.value)}
                  placeholder="e.g. 1990"
                  className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Max Year
                </label>
                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) => handleMaxYearChange(e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Genre Filter */}
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Genres</label>
            <div className="grid grid-cols-5 gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? "bg-[#1ED2AF] text-[#00003c]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Genres Display */}
        {selectedGenres.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Selected Genres:
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="flex items-center gap-2 rounded bg-[#1ED2AF] px-3 py-1 text-sm font-medium text-[#00003c]"
                >
                  {genre}
                  <button
                    onClick={() => removeGenre(genre)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-8 text-center text-white/70">Loading...</div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {titles.map((title) => (
              <div
                key={title.id}
                className="overflow-hidden rounded-lg bg-white/5 transition-transform hover:scale-105"
              >
                <img
                  src={title.image}
                  alt={title.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-1 font-semibold">{title.title}</h3>
                  <p className="mb-2 text-sm text-white/70">{title.released}</p>
                  <p className="text-xs text-white/50">{title.genre}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {titles.length === 0 && (
            <div className="py-8 text-center text-white/70">
              No movies found. Try adjusting your filters.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded bg-[#1ED2AF] px-4 py-2 font-medium text-[#00003c] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Previous
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={titles.length === 0}
              className="rounded bg-[#1ED2AF] px-4 py-2 font-medium text-[#00003c] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
