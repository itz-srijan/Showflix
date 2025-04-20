"use client";

import { useEffect, useState } from "react";
import Slider from "@/Components/Show/Slider";
import Navbar from "@/Components/Navbar";
import { useGenre } from "@/context/GenreContext";
import { motion } from "framer-motion";

export default function Movies() {
  interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    genre_ids: number[];
  }

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const { genres } = useGenre();

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState<"popular" | "topRated">(
    "popular"
  );
  const [loading, setLoading] = useState(false);

  const fetchMoviesFromPages = async (endpoint: string) => {
    const pages = Array.from({ length: 20 }, (_, i) => i + 1);
    const urls = pages.map(
      (page) =>
        `https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=${page}&api_key=${apiKey}`
    );

    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const data = await Promise.all(responses.map((res) => res.json()));
    return data.flatMap((d) => d.results);
  };

  const fetchPopularMovies = async () => {
    try {
      const movies = await fetchMoviesFromPages("popular");
      setPopularMovies(movies);
    } catch (error) {
      console.error("Failed to fetch popular movies:", error);
    }
  };

  const fetchTopRatedMovies = async () => {
    try {
      const movies = await fetchMoviesFromPages("top_rated");
      setRatedMovies(movies);
    } catch (error) {
      console.error("Failed to fetch top rated movies:", error);
    }
  };

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
  }, [apiKey]);

  const uniqueMoviesById = (movies: Movie[]) => {
    const uniqueMap = new Map<number, Movie>();
    movies.forEach((movie) => {
      if (!uniqueMap.has(movie.id)) {
        uniqueMap.set(movie.id, movie);
      }
    });
    return Array.from(uniqueMap.values());
  };

  const filterMovieData = (movies: Movie[]) => {
    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
    }));
  };

  const displayedMovies =
    activeCategory === "popular"
      ? filterMovieData(popularMovies)
      : filterMovieData(ratedMovies);

  const handleToggle = (category: "popular" | "topRated") => {
    setActiveCategory(category);
    if (
      (category === "popular" && popularMovies.length === 0) ||
      (category === "topRated" && ratedMovies.length === 0)
    ) {
      setLoading(true);
      const fetchFn =
        category === "popular" ? fetchPopularMovies : fetchTopRatedMovies;
      fetchFn().finally(() => setLoading(false));
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <Navbar />

      {/* Toggle Buttons - sticky */}
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
            Loading movies...
          </div>
        ) : (
          genres
            .filter(
              (genre) =>
                genre.name.toLowerCase().trim() !== "tv movie" &&
                genre.name.toLowerCase().trim() !== "documentary"
            )
            .map((genre) => {
              const moviesInGenre = displayedMovies.filter((movie) =>
                movie.genre_ids.includes(genre.id)
              );

              const uniqueMovies = uniqueMoviesById(moviesInGenre);

              if (uniqueMovies.length === 0) return null;

              return (
                <Slider
                  key={genre.id}
                  sliderHeader={genre.name}
                  media_type='movie'
                  movieData={uniqueMovies}
                />
              );
            })
        )}
      </div>
    </div>
  );
}
