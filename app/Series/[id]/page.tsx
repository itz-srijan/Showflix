"use client";

import { useEffect, useState } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { PiFilmReelBold } from "react-icons/pi";
import { useParams } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";

export default function Series() {
  interface MovieDetail {
    backdrop_path: string;
    name: string;
    overview: string;
    genres: { id: number; name: string }[];
    first_air_date: string;
    last_air_date: string;
    status: string;
    number_of_seasons: number;
    seasons: {
      name: string;
      air_date: string;
      poster_path: string;
      episode_count: number;
      id: number;
    }[];
  }

  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();
  console.log(params);

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const movieUrl = `https:api.themoviedb.org/3/tv/${params.id}?language=en-US&api_key=${apiKey}`;
  const imageUrl = "https://image.tmdb.org/t/p/original";
  const poster_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    fetch(movieUrl)
      .then((res) => res.json())
      .then((data) => {
        setMovieDetail(data);
        console.log(data);
      });
  }, [movieUrl]);

  if (!movieDetail) return <div>Loading...</div>;

  const bgUrl = `${imageUrl}${movieDetail.backdrop_path}`;
  const shortOverview =
    movieDetail.overview.length > 150
      ? `${movieDetail.overview.slice(0, 200)}...`
      : movieDetail.overview;

  const endDate = (status: string) => {
    if (status === "Ended")
      return new Date(movieDetail.last_air_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    else return "continuing";
  };

  const seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5"];
  //to show seasons
  if (isOpen && movieDetail.number_of_seasons > 1) {
    return (
      <div
        className='relative w-full h-screen bg-cover bg-center text-white font-roboto'
        style={{
          backgroundImage: `url(${bgUrl})`,
        }}
      >
        <button
          className='absolute text-red-800 rounded-full flex items-center justify-center'
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoMdCloseCircle className='top-2 right-2 m-4 w-10 h-10 fixed' />
        </button>
        <div className='absolute top-[10%] left-[10%] right-[10%] bottom-[10%] bg-black bg-opacity-80 rounded-2xl p-4 overflow-y-scroll'>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {movieDetail.seasons.slice(1).map((season) => (
              <div
                key={season.id}
                className='relative overflow-hidden rounded-lg group'
              >
                <img
                  src={`${poster_URL}${season.poster_path}`}
                  alt={season.name}
                  draggable={false}
                  className='w-full h-auto rounded-lg transform transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-blue-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='text-black text-lg font-semibold'>
                    <p>{season.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className='relative w-full h-screen bg-cover bg-center text-white font-roboto'
      style={{
        backgroundImage: `url(${bgUrl})`,
      }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black bg-opacity-60'></div>

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-center h-full p-10 max-w-2xl'>
        <h1 className='text-5xl font-bold'>{movieDetail.name}</h1>
        <div className='flex flex-row items-center gap-4 mt-2'>
          {/* Release date */}
          <div className='flex flex-row items-center'>
            <CiCalendarDate />
            <p className='p-1 text-blue-200'>
              {new Date(movieDetail.first_air_date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                }
              ) +
                " - " +
                endDate(movieDetail.status)}
            </p>
          </div>

          {/* Seasons */}
          <div className='flex flex-row items-center'>
            <div className='flex flex-row items-center p-1'>
              <PiFilmReelBold />
              <p className='p-1'>Seasons : </p>
            </div>
            <p className='p-1 text-blue-200'>{movieDetail.number_of_seasons}</p>
          </div>
        </div>

        {/* Genres */}
        <div className='mt-3 flex gap-2'>
          {movieDetail.genres.map((genre) => (
            <span
              key={genre.id}
              className='bg-red-900 px-3 py-1 rounded-full text-sm'
            >
              {genre.name}
            </span>
          ))}
        </div>
        {/* Overview */}
        <p className='text-lg text-white text-pretty mt-4 italic'>
          {isExpanded ? movieDetail.overview : shortOverview}
          {movieDetail.overview.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-white-500 ml-2 bg-blue-600 p-1 rounded-sm text-sm hover:bg-blue-800'
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </p>

        {/* Buttons */}
        <div className='mt-6 flex gap-4 items-center font-roboto'>
          {/* Season button */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold cursor-pointer'
          >
            Seasons
          </div>
          {/* Trailer Button */}
          <button className='flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlay /> Trailer
          </button>
          {/* Add to Watchlist */}
          <button className='flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlus /> Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
