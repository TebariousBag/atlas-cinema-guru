"use client";

import { useState, useEffect } from "react";
import { UsersTitle } from "@/lib/definitions";
import { FaStar, FaRegStar, FaClock, FaRegClock } from "react-icons/fa";

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

  const toggleFavorite = async (titleId: string, isFavorited: boolean) => {
    try {
      if (isFavorited) {
        // Remove from favorites
        await fetch(`/api/favorites/${titleId}`, { method: "DELETE" });
      } else {
        // Add to favorites
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titleId }),
        });
      }
      // Refresh the titles to update the state
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (searchQuery) params.set("query", searchQuery);
      if (minYear) params.set("minYear", minYear);
      if (maxYear) params.set("maxYear", maxYear);
      if (selectedGenres.length > 0)
        params.set("genres", selectedGenres.join(","));

      const res = await fetch(`/api/titles?${params.toString()}`);
      const data = await res.json();
      setTitles(data.title || []);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleWatchLater = async (titleId: string, isWatchLater: boolean) => {
    try {
      if (isWatchLater) {
        // Remove from watch later
        await fetch(`/api/watch-later/${titleId}`, { method: "DELETE" });
      } else {
        // Add to watch later
        await fetch("/api/watch-later", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titleId }),
        });
      }
      // Refresh the titles to update the state
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (searchQuery) params.set("query", searchQuery);
      if (minYear) params.set("minYear", minYear);
      if (maxYear) params.set("maxYear", maxYear);
      if (selectedGenres.length > 0)
        params.set("genres", selectedGenres.join(","));

      const res = await fetch(`/api/titles?${params.toString()}`);
      const data = await res.json();
      setTitles(data.title || []);
    } catch (error) {
      console.error("Error toggling watch later:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="mb-6 space-y-4 rounded-lg bg-white/5 p-4">
        {/* Top Row: Search/Years on left, Genres on right */}
        <div className="flex gap-6">
          {/* Left Side: Search and Year Filters - 1/3 width */}
          <div className="w-1/3 space-y-4">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Movies..."
                className="w-full rounded-full border-2 border-[#1ED2AF] bg-[#00003c] px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
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
                  className="w-full rounded-full border-2 border-[#1ED2AF] bg-[#00003c] px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
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
                  className="w-full rounded-full border-2 border-[#1ED2AF] bg-[#00003c] px-4 py-2 text-white placeholder-white/50 focus:border-[#1ED2AF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Middle: Empty Space - 1/3 width */}
          <div className="w-1/3"></div>

          {/* Right Side: Genre Filter - 1/3 width */}
          <div className="w-1/3">
            <label className="mb-2 block text-sm font-medium">Genres</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-5">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? "border-[#1ED2AF] bg-[#1ED2AF] text-[#00003c]"
                      : "border-[#1ED2AF] bg-[#00003c] text-white hover:bg-[#1ED2AF] hover:text-[#00003c]"
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
          <div className="mb-6 grid grid-cols-3 gap-4">
            {titles.map((title) => (
              <div
                key={title.id}
                className="group relative overflow-hidden rounded-lg border-2 border-[#1ED2AF] bg-[#00003c] transition-transform hover:scale-105"
              >
                <img
                  src={title.image}
                  alt={title.title}
                  className="h-80 w-full object-cover"
                />

                {/* Action Buttons - Top Right */}
                <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(title.id, title.favorited);
                    }}
                    className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                  >
                    {title.favorited ? (
                      <FaStar className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <FaRegStar className="h-5 w-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchLater(title.id, title.watchLater);
                    }}
                    className="rounded-full bg-white/20 p-2 hover:bg-white/30"
                  >
                    {title.watchLater ? (
                      <FaClock className="h-5 w-5 text-[#1ED2AF]" />
                    ) : (
                      <FaRegClock className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Hover Overlay - Bottom Third */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex flex-col justify-end bg-[#00003c]/95 p-3 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ height: "40%" }}
                >
                  <div className="mb-1 pt-2">
                    <h3 className="text-sm font-bold leading-tight">
                      {title.title} ({title.released})
                    </h3>
                  </div>
                  <p className="mb-2 text-xs leading-relaxed text-white/90">
                    {title.synopsis}
                  </p>
                  <div className="flex">
                    <span className="rounded-full bg-[#1ED2AF] px-2 py-0.5 text-xs font-medium text-[#00003c]">
                      {title.genre}
                    </span>
                  </div>
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
          <div className="flex items-center justify-center">
            <div className="inline-flex rounded-full bg-[#1ED2AF] overflow-hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2 font-medium text-[#00003c] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#17a589]"
              >
                Previous
              </button>
              <div className="w-px bg-[#00003c] p-1"></div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={titles.length === 0}
                className="px-6 py-2 font-medium text-[#00003c] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#17a589]"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
