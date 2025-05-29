"use client";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useEffect, useState } from "react";
import tmdb from "@/lib/axios";
import TrendingCarousel from "@/Components/Show/TrendingCarousal";
import ShowSlider from "@/Components/Show/ShowSlider";
import GenreCarousel from "@/Components/Show/GenreCaraousel";

export default function Home() {
  interface MovieData {
    results: {
      title: string;
      backdrop_path: string;
      poster_path: string;
      name: string;
      genre_ids: number[];
      overview: string;
      media_type: string;
      id: number;
    }[];
  }

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  // fetching trending movies
  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        const res = await tmdb.get("/trending/all/day");
        setMovieData(res.data);
      } catch (error) {
        console.error("facing issues while fetching trending data:", error);
      }
    }
    fetchTrendingMovies();
  }, []);

  const trendingMovieData = movieData?.results
    .filter(
      (movie) => movie.media_type === "movie" || movie.media_type === "tv"
    )
    .map((movie) => ({
      backdrop_path: movie.backdrop_path,
      poster_path: movie.poster_path,
      title: movie.title ? movie.title : movie.name,
      genre_ids: movie.genre_ids,
      overview: movie.overview,
      media_type: movie.media_type,
      id: movie.id,
    }));

  return (
    <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <Navbar />
      <TrendingCarousel trendingMovieData={trendingMovieData} />
      <GenreCarousel />
      <ShowSlider />
      <Footer />
    </div>
  );
}
