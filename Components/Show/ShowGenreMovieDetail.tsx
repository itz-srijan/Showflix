import { useState, useEffect } from "react";
import Slider from "./Slider";

interface ShowGenreMovieDetailProps {
  genre: {
    id: number;
    name: string;
  };
}
export default function ShowGenreMovieDetail({
  genre,
}: ShowGenreMovieDetailProps) {
  interface MovieData {
    id: number;
    poster_path: string;
    title: string;
    genre_ids: number[];
  }

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const popularMovieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre.id}&sort_by=popularity.desc&page=1`;
  const topRatedMovieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre.id}&sort_by=vote_average.desc&vote_count.gte=1000&page=1
`;

  const [popularMovies, setPopularMovies] = useState<MovieData[] | null>(null);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieData[] | null>(null);

  useEffect(() => {
    fetch(popularMovieUrl)
      .then((response) => response.json())
      .then((data) => {
        setPopularMovies(data.results as MovieData[]); // Ensure type safety
      });
  }, [popularMovieUrl]);

  useEffect(() => {
    fetch(topRatedMovieUrl)
      .then((response) => response.json())
      .then((data) => {
        setTopRatedMovies(data.results as MovieData[]); // Ensure type safety
      });
  }, [topRatedMovieUrl]);

  return (
    <div>
      <Slider
        sliderHeader={`Popular in ${genre.name}`}
        media_type='movie'
        movieData={popularMovies || []}
      />
      <Slider sliderHeader={`Top rated in ${genre.name}`}
        media_type='movie'
        movieData={topRatedMovies || []}/>
    </div>
  );
}
