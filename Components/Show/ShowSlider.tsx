import { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "./Slider";

export default function ShowSlider() {
  interface MovieData {
    results: {
      id: number;
      title: string;
      poster_path: string;
      name: string;
      genre_ids: number[];
      media_type: string;
    }[];
  }
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const popularUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${apiKey}`;
  const topRatedUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&api_key=${apiKey}`;
  const [popularMovieData, setPopularMovieData] = useState<MovieData | null>(
    null
  );
  const [topRatedMovieData, setTopRatedMovieData] = useState<MovieData | null>(
    null
  );
  // fetching popular movies
  useEffect(() => {
    fetch(popularUrl)
      .then((res) => res.json())
      .then((data) => {
        setPopularMovieData(data);
        // console.log(data);
      });
  }, [popularUrl]);
  // fetching top rated movies
  useEffect(() => {
    fetch(topRatedUrl)
      .then((res) => res.json())
      .then((data) => {
        setTopRatedMovieData(data);
        // console.log(data);
      });
  }, [topRatedUrl]);

  // Filter object movie data from api to a array only include necessary fields
  const filterMovieData = (data: MovieData) => {
    return data
      ? data.results.map((movie) => ({
          id: movie.id,
          poster_path: movie.poster_path,
          title: movie.title || movie.name,
          genre_ids: movie.genre_ids,
        }))
      : null;
  };
  return (
    <div>
      {/* popular */}
      {popularMovieData && (
        <Slider
          sliderHeader='Popular Among People'
          media_type='movie'
          movieData={filterMovieData(popularMovieData)}
        />
      )}
      {/* top rated */}
      {topRatedMovieData && (
        <Slider
          media_type='tv'
          sliderHeader='Top Rated'
          movieData={filterMovieData(topRatedMovieData)}
        />
      )}
    </div>
  );
}
