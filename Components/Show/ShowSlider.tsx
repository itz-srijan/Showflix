import { useEffect, useState } from "react";
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
  const popularMovieUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${apiKey}`;
  const topRatedMovieUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${apiKey}`;
  const popularSeriesUrl = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1&api_key=${apiKey}`;
  const topRatedSeriesUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&api_key=${apiKey}`;
  const [popularMovieData, setPopularMovieData] = useState<MovieData | null>(
    null
  );
  const [topRatedMovieData, setTopRatedMovieData] = useState<MovieData | null>(
    null
  );
  const [popularSeriesData, setPopularSeriesData] = useState<MovieData | null>(
    null
  );
  const [
    topRatedSeriesData,
    setTopRatedSeriesData,
  ] = useState<MovieData | null>(null);
  // fetching popular movies
  useEffect(() => {
    fetch(popularMovieUrl)
      .then((res) => res.json())
      .then((data) => {
        setPopularMovieData(data);
        // console.log(data);
      });
  }, [popularMovieUrl]);
  //fetching top rated movies
  useEffect(() => {
    fetch(topRatedMovieUrl)
      .then((res) => res.json())
      .then((data) => {
        setTopRatedMovieData(data);
        // console.log(data);
      });
  }, [topRatedMovieUrl]);
  // fetching popular series
  useEffect(() => {
    fetch(popularSeriesUrl)
      .then((res) => res.json())
      .then((data) => {
        setPopularSeriesData(data);
        // console.log(data);
      });
  }, [popularSeriesUrl]);
  // fetching top rated series
  useEffect(() => {
    fetch(topRatedSeriesUrl)
      .then((res) => res.json())
      .then((data) => {
        setTopRatedSeriesData(data);
        // console.log(data);
      });
  }, [topRatedSeriesUrl]);

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
      {/* popular movie*/}
      {popularMovieData && (
        <Slider
          sliderHeader='Popular in Movies'
          media_type='movie'
          movieData={filterMovieData(popularMovieData)}
        />
      )}
      {/* top rated movie */}
      {topRatedMovieData && (
        <Slider
          media_type='movie'
          sliderHeader='Top Rated Movies'
          movieData={filterMovieData(topRatedMovieData)}
        />
      )}
      {/* top rated */}
      {topRatedSeriesData && (
        <Slider
          media_type='tv'
          sliderHeader='Top Rated Series'
          movieData={filterMovieData(topRatedSeriesData)}
        />
      )}
      {/* popular series */}
      {popularSeriesData && (
        <Slider
          media_type='tv'
          sliderHeader='Popular in TV'
          movieData={filterMovieData(popularSeriesData)}
        />
      )}
    </div>
  );
}
