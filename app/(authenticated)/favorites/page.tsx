"use client";

import { useState, useEffect } from "react";
import { UsersTitle } from "@/lib/definitions";
import { FaStar, FaRegStar, FaClock, FaRegClock } from "react-icons/fa";

export default function FavoritesPage() {
  const [titles, setTitles] = useState<UsersTitle[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch favorite titles
  useEffect(() => {
    setLoading(true);
    fetch(`/api/favorites?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setTitles(data.favorites || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page]);

  const toggleFavorite = async (titleId: string, isFavorited: boolean) => {
    try {
      if (isFavorited) {
        await fetch(`/api/favorites/${titleId}`, { method: "DELETE" });
      } else {
        await fetch(`/api/favorites/${titleId}`, {
          method: "POST",
        });
      }
      // Refresh the titles
      const res = await fetch(`/api/favorites?page=${page}`);
      const data = await res.json();
      setTitles(data.favorites || []);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleWatchLater = async (titleId: string, isWatchLater: boolean) => {
    try {
      if (isWatchLater) {
        await fetch(`/api/watch-later/${titleId}`, { method: "DELETE" });
      } else {
        await fetch(`/api/watch-later/${titleId}`, {
          method: "POST",
        });
      }
      // Refresh the titles
      const res = await fetch(`/api/favorites?page=${page}`);
      const data = await res.json();
      setTitles(data.favorites || []);
    } catch (error) {
      console.error("Error toggling watch later:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Favorites</h1>

      {/* Loading State */}
      {loading && (
        <div className="py-8 text-center text-white/70">Loading...</div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-6">
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
              No movies in your favorites list.
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
