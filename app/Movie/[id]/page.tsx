"use client";

import { useEffect, useState } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Movie() {
  interface MovieDetail {
    backdrop_path: string;
    title: string;
    overview: string;
    genres: { id: number; name: string }[];
    original_language: string;
    release_date: string;
    runtime: number;
  }

  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const params = useParams();
  const movieId = params.id as string;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${apiKey}`;
  const imageUrl = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    fetch(movieUrl)
      .then((res) => res.json())
      .then((data) => {
        setMovieDetail(data);
        console.log(data);
      });
  }, [movieUrl]);

  const router = useRouter();

  if (!movieDetail) return <div>Loading...</div>;

  const bgUrl = `${imageUrl}${movieDetail.backdrop_path}`;
  const shortOverview =
    movieDetail.overview.length > 150
      ? `${movieDetail.overview.slice(0, 200)}...`
      : movieDetail.overview;

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
        <h1 className='text-5xl font-bold'>{movieDetail.title}</h1>
        <div className='flex flex-row items-center gap-4 mt-2'>
          {/* Release date */}
          <div className='flex flex-row items-center'>
            <CiCalendarDate />
            <p className='p-1 text-blue-200'>
              {new Date(movieDetail.release_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </p>
          </div>

          {/* Runtime */}
          <div className='flex flex-row items-center'>
            <CiTimer />
            <p className='p-1 text-blue-200'>
              {(() => {
                const hours = Math.floor(movieDetail.runtime / 60);
                const mins = movieDetail.runtime % 60;
                return `${hours}h ${mins}m`;
              })()}
            </p>
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
        <div className='mt-6 flex gap-4'>
          <button
            onClick={() => router.push(`/Movie/${movieId}/Play`)}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold'
          >
            <FaPlay /> Play
          </button>
          <button className='flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlay /> Trailer
          </button>
          <button className='flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlus /> Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
