"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "@/Components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";

type WatchlistItem = {
  tmdbID: string;
  title: string;
  media_type: string;
  posterUrl: string;
};

export default function WatchlistPage() {
  const [movies, setMovies] = useState<WatchlistItem[]>([]);
  const [series, setSeries] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const poster_image_url = "https://image.tmdb.org/t/p/w500";

  const router = useRouter();

  const fetchWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist/add/get");
      const data: WatchlistItem[] = await res.json();

      const movieItems = data.filter((item) => item.media_type === "movie");
      const seriesItems = data.filter((item) => item.media_type === "tv");

      setMovies(movieItems);
      setSeries(seriesItems);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleClearWatchlist = async () => {
    try {
      setClearing(true);
      const response = await fetch("/api/watchlist/add/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to clear watchlist: ${errorText}`);
      }

      setMovies([]);
      setSeries([]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error clearing watchlist:", error);
    } finally {
      setClearing(false);
    }
  };

  const handleDelete = async (tmdbID: string, media_type: string) => {
    try {
      const res = await fetch("/api/watchlist/add/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbID, media_type }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete item: ${errorText}`);
      }

      setMovies((prev) =>
        prev.filter(
          (item) => !(item.tmdbID === tmdbID && item.media_type === media_type)
        )
      );
      setSeries((prev) =>
        prev.filter(
          (item) => !(item.tmdbID === tmdbID && item.media_type === media_type)
        )
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderSection = (title: string, items: WatchlistItem[]) => (
    <section className='mb-12'>
      {items.length > 0 && (
        <>
          <h2 className='text-3xl font-bold mb-6 text-white text-center border-b border-gray-600 pb-2'>
            {title}
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {items.map((item) => (
              <div
                key={item.tmdbID}
                onClick={() =>
                  router.push(
                    item.media_type === "movie"
                      ? `/Movie/${item.tmdbID}`
                      : `/Series/${item.tmdbID}`
                  )
                }
                className='relative cursor-pointer rounded-xl overflow-hidden shadow-lg bg-black/80 border border-gray-700 transition-transform duration-300 group'
              >
                <Image
                  src={`${poster_image_url}${item.posterUrl}`}
                  alt={item.title}
                  width={500}
                  height={800}
                  className='w-full h-64 object-cover'
                />

                <div className='absolute right-2 top-2 z-20'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.tmdbID, item.media_type);
                    }}
                    className='p-2 bg-red-600 hover:bg-red-800 rounded-full backdrop-blur-md bg-opacity-80 text-white transition-colors'
                    title='Remove from Watchlist'
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className='p-3 text-center text-white text-base font-semibold bg-black/60 backdrop-blur-md'>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );

  return (
    <div>
      <Navbar />
      <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed px-6 sm:px-10 py-10">
        {showToast && (
          <div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn'>
            ✅ Watchlist cleared successfully!
          </div>
        )}

        <div className='mt-8 flex justify-between items-center mb-10'>
          <h1 className='text-4xl font-extrabold text-white'>
            {movies.length > 0 || series.length > 0
              ? "Your Watchlist"
              : "Your List is Empty !!"}
          </h1>
          {(movies.length > 0 || series.length > 0) && (
            <button
              onClick={handleClearWatchlist}
              className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all text-sm sm:text-base'
              disabled={clearing}
            >
              <FaTrash />
              {clearing ? "Clearing..." : "Clear Watchlist"}
            </button>
          )}
        </div>

        {loading ? (
          <p className='text-white text-lg'>Loading your watchlist...</p>
        ) : (
          <>
            {renderSection("Movies", movies)}
            {renderSection("Series", series)}
          </>
        )}
      </div>
    </div>
  );
}
