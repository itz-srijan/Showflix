"use client";

import Navbar from "@/Components/Navbar";
import { useEffect, useState } from "react";
import TrendingCarousel from "@/Components/Show/TrendingCarousal";
import ShowSlider from "@/Components/Show/ShowSlider";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`;

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
    }[];
  }

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  // fetching trending movies
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovieData(data);
        console.log(data);
      });
  }, []);

  const trendingMovieData = movieData?.results.map((movie) => ({
    backdrop_path: movie.backdrop_path,
    poster_path: movie.poster_path,
    title: movie.title ? movie.title : movie.name,
    genre_ids: movie.genre_ids,
    overview: movie.overview,
    media_type: movie.media_type,
  }));

  return (
    <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <Navbar />
      <TrendingCarousel trendingMovieData={trendingMovieData} />
      <ShowSlider />
    </div>
  );
}
