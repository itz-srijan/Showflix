"use client";

import Navbar from "@/Components/Navbar";
import { useEffect, useState } from "react";
import TrendingCarousel from "@/Components/Show/TrendingCarousal";
import MovieSlider from "@/Components/Show/MovieSlider";

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const movieIdToGenre = (GenreId : number) =>{
  const [genreList, setGenreList] = useState<{id : number; name: string}[] | null>(null);
  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?&api_key=${apiKey}`;

  // fetching a list of genres from genre id
  useEffect(() => {
    fetch(genreUrl)
      .then((res) => res.json())
      .then((data) => {
        setGenreList(data.genres);
      });
  }, [genreUrl]);
  
  let name = genreList?.find((genre: {id : number; name: string}) => genre.id === GenreId)?.name;
  return name ? name : '';

}
// Removed as the function is now exported inline

export default function Home() {
  interface MovieData {
    results: {
      title: string;
      backdrop_path: string;
      poster_path: string;
      name: string;
      genre_ids: number[];
    }[];
  }

  const [movieData, setMovieData] = useState<MovieData | null>(null);

  const url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`;
  
  // console.log(genreList);
  // fetching trending movies
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovieData(data);
        // console.log(data);
      });
  }, [url]);

  const trendingMovieData = movieData?.results.map((movie) => ({
    backdrop_path: movie.backdrop_path,
    poster_path: movie.poster_path,
    title: movie.title ? movie.title : movie.name,
    genre_ids: movie.genre_ids,
  }));

  return (
    <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <Navbar />
      <div className='mt-0.5 p-4'>
        <TrendingCarousel
          trendingMovieData={trendingMovieData}
        />
      </div>
      <MovieSlider />
    </div>
  );
}
