"use client";

import { useEffect, useState } from "react";
import Slider from "@/Components/Show/Slider";
import Navbar from "@/Components/Navbar";
import { useGenre } from "@/context/GenreContext";
import { motion } from "framer-motion";

export default function Series() {
  interface SeriesType {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
  }

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const { showSeriesGenres } = useGenre();

  const [popularSeries, setPopularSeries] = useState<SeriesType[]>([]);
  const [ratedSeries, setRatedSeries] = useState<SeriesType[]>([]);
  const [activeCategory, setActiveCategory] = useState<"popular" | "topRated">(
    "popular"
  );
  const [loading, setLoading] = useState(false);

  const fetchSeriesFromPages = async (endpoint: string) => {
    const pages = Array.from({ length: 20 }, (_, i) => i + 1);
    const urls = pages.map(
      (page) =>
        `https://api.themoviedb.org/3/tv/${endpoint}?language=en-US&page=${page}&api_key=${apiKey}`
    );

    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const data = await Promise.all(responses.map((res) => res.json()));
    return data.flatMap((d) => d.results);
  };

  const fetchPopularSeries = async () => {
    try {
      const series = await fetchSeriesFromPages("popular");
      setPopularSeries(series);
    } catch (error) {
      console.error("Failed to fetch popular series:", error);
    }
  };

  const fetchTopRatedSeries = async () => {
    try {
      const series = await fetchSeriesFromPages("top_rated");
      setRatedSeries(series);
    } catch (error) {
      console.error("Failed to fetch top rated series:", error);
    }
  };

  useEffect(() => {
    fetchPopularSeries();
    fetchTopRatedSeries();
  }, [apiKey]);

  const uniqueSeriesById = (series: SeriesType[]) => {
    const uniqueMap = new Map<number, SeriesType>();
    series.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const filterSeriesData = (series: SeriesType[]) => {
    return series.map((item) => ({
      id: item.id,
      name: item.name,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      genre_ids: item.genre_ids,
    }));
  };

  const displayedSeries =
    activeCategory === "popular"
      ? filterSeriesData(popularSeries)
      : filterSeriesData(ratedSeries);

  const handleToggle = (category: "popular" | "topRated") => {
    setActiveCategory(category);
    if (
      (category === "popular" && popularSeries.length === 0) ||
      (category === "topRated" && ratedSeries.length === 0)
    ) {
      setLoading(true);
      const fetchFn =
        category === "popular" ? fetchPopularSeries : fetchTopRatedSeries;
      fetchFn().finally(() => setLoading(false));
    }
  };

  const seriesGenres = showSeriesGenres();

  return (
    <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <Navbar />

      {/* Toggle Buttons */}
      <div className='sticky top-16 z-40 p-4'>
        <div className='backdrop-blur-md bg-black/40 rounded-full p-1 flex gap-2 w-fit mx-auto'>
          {["popular", "topRated"].map((category) => (
            <motion.button
              key={category}
              onClick={() => handleToggle(category as "popular" | "topRated")}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2 rounded-full font-semibold transition-all duration-300 overflow-hidden ${
                activeCategory === category
                  ? "text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {activeCategory === category && (
                <motion.span
                  layoutId='toggleActive'
                  className='absolute inset-0 bg-blue-400 rounded-full z-[-1]'
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {category === "popular" ? "Popular" : "Top Rated"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className='pt-6'>
        {loading ? (
          <div className='text-white text-xl font-semibold text-center py-20'>
            Loading Series...
          </div>
        ) : (
          seriesGenres
            .filter(
              (genre) =>
                genre.name.toLowerCase().trim() !== "tv movie" &&
                genre.name.toLowerCase().trim() !== "documentary"
            )
            .map((genre) => {
              const seriesInGenre = displayedSeries.filter((item) =>
                item.genre_ids.includes(genre.id)
              );

              const uniqueSeries = uniqueSeriesById(seriesInGenre);

              if (uniqueSeries.length === 0) return null;

              return (
                <Slider
                  key={genre.id}
                  sliderHeader={genre.name}
                  media_type='tv'
                  movieData={uniqueSeries.map(({ id, poster_path, name, genre_ids }) => ({
                    id,
                    poster_path,
                    title: name,
                    genre_ids,
                  }))}
                />
              );
            })
        )}
      </div>
    </div>
  );
}
