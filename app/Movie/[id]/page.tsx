"use client";

import { useEffect, useState } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { useParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Image from "next/image";
import TrailerModal from "@/Components/TrailerModal";

export default function Movie() {
  interface MovieDetail {
    backdrop_path: string;
    title: string;
    overview: string;
    genres: { id: number; name: string }[];
    original_language: string;
    release_date: string;
    runtime: number;
    poster_path: string;
    videos: {
      results: {
        id: number;
        key: string;
        iso_639_1: string;
        site: string;
        type: string;
      }[];
    };
  }

  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [logos, setLogos] = useState<
    { file_path: string; iso_639_1: string }[]
  >([]);

  const params = useParams();
  const movieId = params.id as string;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${apiKey}&append_to_response=videos&language=en-US`;
  const backdropsUrl = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`;
  const imageUrl = "https://image.tmdb.org/t/p/original";
  const LOGO_URL = "https://image.tmdb.org/t/p/w500";

  const handleOpenPlayer = (id: unknown) => {
    const url = `/Movie/${id}/play`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    fetch(movieUrl)
      .then((res) => res.json())
      .then((data) => {
        setMovieDetail(data);
        // console.log(data);
      });
  }, [movieUrl]);

  useEffect(() => {
    fetch(backdropsUrl)
      .then((res) => res.json())
      .then((data) => {
        setLogos(data.logos);
        // console.log(data);
      });
  }, [backdropsUrl]);

  // to show trailer
  const [youtubeKey, setYoutubeKey] = useState<string | null>(null);

  const handleTrailerClick = () => {
    const trailer = movieDetail?.videos?.results.find(
      (item) =>
        item.type === "Trailer" &&
        item.site === "YouTube" &&
        item.iso_639_1 === "en"
    );

    if (trailer) {
      setYoutubeKey(trailer.key);
    } else {
      alert("Trailer not found");
    }
  };

  //check if present in watchlist
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const media_type = "movie";

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const res = await fetch(
          `/api/watchlist/check?tmdbID=${movieId}&media_type=${media_type}`
        );
        if (res.ok) {
          const data = await res.json();
          setAdded(data.added);
        }
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [movieId, media_type]);

  //to add to watchlist
  const title = movieDetail?.title;
  const posterUrl = movieDetail?.backdrop_path;

  const handleAddToWatchlist = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbID: movieId,
          title,
          media_type,
          posterUrl,
        }),
      });

      if (res.ok) {
        setAdded(true);
      } else {
        const msg = await res.text();
        console.error("Error:", msg);
      }
    } catch (err) {
      console.error("Failed to add to watchlist", err);
    } finally {
      setIsAdding(false);
    }
  };

  const logo = logos.find((logo) => logo.iso_639_1 === "en");

  if (!movieDetail)
    return <div className='text-white text-center mt-10'>Loading...</div>;

  const bgUrl = `${imageUrl}${movieDetail.backdrop_path}`;
  const shortOverview =
    movieDetail.overview.length > 150
      ? `${movieDetail.overview.slice(0, 200)}...`
      : movieDetail.overview;

  return (
    <div
      className='relative w-full min-h-screen bg-cover bg-center text-white'
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent'></div>
      <Navbar />
      {/* showing trailer */}
      {youtubeKey && (
        <TrailerModal
          youtubeKey={youtubeKey}
          onClose={() => setYoutubeKey(null)}
        />
      )}
      {/* Content */}
      <div className='mt-7 relative z-10 flex flex-col justify-center min-h-screen p-6 sm:p-10 md:p-16 max-w-4xl'>
        <div className='max-w-3xl'>
          {logo ? (
            <Image
              src={`${LOGO_URL}${logo.file_path}`}
              alt={movieDetail.title}
              priority={true}
              width={350}
              height={200}
              objectFit='contain'
              className='mb-4'
            />
          ) : (
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>
              {movieDetail.title}
            </h1>
          )}

          <div className='flex flex-wrap items-center gap-6 text-blue-200 text-sm sm:text-base mb-4'>
            {/* Release date */}
            <div className='flex items-center gap-2'>
              <CiCalendarDate size={20} />
              <span>
                {new Date(movieDetail.release_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  }
                )}
              </span>
            </div>

            {/* Runtime */}
            <div className='flex items-center gap-2'>
              <CiTimer size={20} />
              <span>
                {(() => {
                  const hours = Math.floor(movieDetail.runtime / 60);
                  const mins = movieDetail.runtime % 60;
                  return `${hours}h ${mins}m`;
                })()}
              </span>
            </div>
          </div>

          {/* Genres */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {movieDetail.genres.map((genre) => (
              <span
                key={genre.id}
                className='bg-red-800/80 text-white px-3 py-1 rounded-full text-xs sm:text-sm shadow-md'
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div className='mb-6'>
            <p className='text-base sm:text-lg text-white/90 leading-relaxed text-pretty italic'>
              {isExpanded ? movieDetail.overview : shortOverview}
            </p>
            {movieDetail.overview.length > 150 && (
              <div className='mt-2'>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition'
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className='mt-4 flex flex-wrap gap-4'>
            <button
              onClick={() => handleOpenPlayer(movieId)}
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm sm:text-base font-semibold shadow-md transition-transform hover:scale-105'
            >
              <FaPlay /> Play
            </button>

            <button
              onClick={handleTrailerClick}
              className='flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm sm:text-base font-semibold shadow-md transition-transform hover:scale-105'
            >
              <FaPlay /> Trailer
            </button>

            <button
              onClick={handleAddToWatchlist}
              disabled={isAdding || added}
              className={`flex items-center gap-2 ${
                added
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-800"
              } text-white px-6 py-2.5 rounded-lg text-sm sm:text-base font-semibold shadow-md transition-transform hover:scale-105`}
            >
              {added ? <SiTicktick /> : <FaPlus />}
              {added ? "Added" : isAdding ? "Adding..." : "Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
