"use client";

import { useEffect, useState } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { CiCalendarDate } from "react-icons/ci";
import { useParams } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import Navbar from "@/Components/Navbar";
import TrailerModal from "@/Components/TrailerModal";

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
      season_number: number;
    }[];
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
  interface SeasonData {
    name: string;
    air_date: string;
    episodes: { name: string; episode_number: number; still_path: string }[];
    season_number: number;
    overview: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [season, setSeason] = useState(0);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);

  const params = useParams();
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const seriesURL = `https://api.themoviedb.org/3/tv/${params.id}?language=en-US&api_key=${apiKey}&append_to_response=videos`;
  const seasonUrl = `https://api.themoviedb.org/3/tv/${params.id}/season/${season}?language=en-US&api_key=${apiKey}&append_to_response=videos`;
  const imageUrl = "https://image.tmdb.org/t/p/original";
  const poster_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    fetch(seriesURL)
      .then((res) => res.json())
      .then((data) => {
        setMovieDetail(data);
        console.log(data);
      });
  }, [seriesURL]);

  useEffect(() => {
    if (season > 0) {
      fetch(seasonUrl)
        .then((res) => res.json())
        .then((data) => {
          setSeasonData(data);
          // console.log(data);
        });
    }
  }, [seasonUrl, season]);

  // to show trailer
  const [youtubeKey, setYoutubeKey] = useState<string | null>(null);

  const handleTrailerClick = async () => {
    let trailer = null;
    if (season < 1) {
      trailer = movieDetail?.videos?.results.find(
        (item) =>
          item.type === "Trailer" &&
          item.site === "YouTube" &&
          item.iso_639_1 === "en"
      );
    } else {
      trailer = seasonData?.videos?.results.find(
        (item) =>
          item.type === "Trailer" &&
          item.site === "YouTube" &&
          item.iso_639_1 === "en"
      );
    }
    if (trailer) {
      setYoutubeKey(trailer.key);
    } else {
      alert("Trailer not found");
    }
  };

  //check if present in watchlist
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const media_type = "tv";
  const movieId = params.id;

  useEffect(() => {
    if (!movieId) return;

    const checkWatchlist = async () => {
      try {
        const res = await fetch(
          `/api/watchlist/check?tmdbID=${movieId}&media_type=${media_type}`
        );

        if (!res.ok) {
          throw new Error(`Failed to check watchlist: ${res.status}`);
        }

        const data = await res.json();
        setAdded(data.added);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [movieId, media_type]);

  const title = movieDetail?.name;
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

  //open new play tab
  const handleOpenPlayer = (id: unknown, season: number, episode: number) => {
    const url = `/Series/${id}/play?season=${season}&episode=${episode}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!movieDetail)
    return <div className='text-white text-center mt-10'>Loading...</div>;

  const bgUrl = `${imageUrl}${movieDetail.backdrop_path}`;
  const shortOverview = (overview: string) =>
    overview.length > 150 ? `${overview.slice(0, 200)}...` : overview;

  const endDate = (status: string) =>
    status === "Ended"
      ? new Date(movieDetail.last_air_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "Continuing";

  if (isOpen && movieDetail.number_of_seasons > 1) {
    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className='relative z-10 w-[90%] max-w-6xl max-h-[90vh] bg-black/60 backdrop-blur-md text-white rounded-2xl shadow-2xl p-8 overflow-y-auto'>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className='absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors'
          >
            <IoMdCloseCircle size={36} />
          </button>

          {/* Heading */}
          <h2 className='text-3xl font-bold mb-6 text-center'>
            Select a Season
          </h2>

          {/* Season Grid */}
          <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {movieDetail.seasons.map((s) => (
              s.name !== "Specials" &&
              <div
                key={s.id}
                onClick={() => {
                  setSeason(s.season_number);
                  setIsOpen(false);
                }}
                className='relative cursor-pointer rounded-lg overflow-hidden group transition-transform hover:scale-105'
              >
                <Image
                  src={`${poster_URL}${s.poster_path}`}
                  alt={s.name}
                  width={300}
                  height={450}
                  className='rounded-lg'
                />
                <div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <span className='text-white font-semibold text-center text-sm'>
                    {s.name}
                  </span>
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
      className='relative w-full min-h-screen bg-cover bg-center text-white'
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent'></div>
      <Navbar />
      {youtubeKey && (
        <TrailerModal
          youtubeKey={youtubeKey}
          onClose={() => setYoutubeKey(null)}
        />
      )}
      {/* Content */}
      <div className='relative z-10 flex flex-col justify-center min-h-screen px-6 py-2 sm:p-10 md:p-16 max-w-4xl'>
        <h1 className='text-4xl sm:text-5xl font-extrabold drop-shadow-lg mb-4'>
          {movieDetail.name}
          {season > 0 && ` - ${seasonData?.name}`}
        </h1>

        {/* Date and Seasons Info */}
        <div className='flex flex-wrap items-center gap-6 text-blue-200 text-sm sm:text-base mb-4'>
          <div className='flex items-center gap-2'>
            <CiCalendarDate size={20} />
            <span>
              {season === 0
                ? `${new Date(
                    movieDetail.first_air_date
                  ).getFullYear()} - ${endDate(movieDetail.status)}`
                : seasonData?.air_date
                ? new Date(seasonData.air_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })
                : ""}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span>{season === 0 ? "Seasons:" : "Episodes:"}</span>
            <span className='text-white'>
              {season === 0
                ? movieDetail.number_of_seasons
                : seasonData?.episodes.length}
            </span>
          </div>
        </div>

        {/* Genres */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {movieDetail.genres.map((genre) => (
            <span
              key={genre.id}
              className='bg-red-800/80 px-3 py-1 rounded-full text-sm shadow-md'
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Overview */}

        {(() => {
          const overview =
            season === 0 ? movieDetail.overview : seasonData?.overview;
          return (
            <div className='mb-6'>
              <p className='text-base sm:text-lg text-white/90 leading-relaxed text-pretty italic mb-2'>
                {isExpanded ? overview : shortOverview(overview || "")}
              </p>
              {overview && overview.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition'
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          );
        })()}

        {/* Action Buttons */}
        <div className='mt-4 mb-0 flex flex-wrap gap-4'>
          {movieDetail.number_of_seasons > 1 && (
            <button
              onClick={() => setIsOpen(true)}
              className='bg-purple-800 hover:bg-purple-950 px-6 py-2.5 rounded-lg font-semibold text-white transition-transform hover:scale-105'
            >
              Seasons
            </button>
          )}
          <button
            onClick={() => {
              if (season === 0) handleOpenPlayer(params.id, 1, 1);
              else handleOpenPlayer(params.id, season, 1);
            }}
            className='bg-blue-600 hover:bg-blue-800 px-6 py-2.5 rounded-lg font-semibold text-white flex items-center gap-2 transition-transform hover:scale-105'
          >
            <FaPlay /> {season === 0 ? "S1 E1" : "Play E1"}
          </button>
          <button
            onClick={handleTrailerClick}
            className='bg-gray-700 hover:bg-gray-800 px-6 py-2.5 rounded-lg font-semibold text-white flex items-center gap-2 transition-transform hover:scale-105'
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
      {/* episodes */}
      {season > 0 && (
        <div className='relative z-30 w-full mt-[-4rem] px-4 sm:px-10'>
          <h2 className='text-3xl font-bold text-white text-left mb-4'>
            Episodes :
          </h2>
          <div className='flex justify-center'>
            <div
              className='flex gap-6 overflow-x-auto pb-2'
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {seasonData?.episodes.map((ep) => (
                <div
                  onClick={() =>
                    handleOpenPlayer(params.id, season, ep.episode_number)
                  }
                  key={ep.episode_number}
                  className='relative min-w-[240px] sm:min-w-[300px] h-[190px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer'
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${ep.still_path}`}
                    alt={ep.name}
                    width={780}
                    height={439}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-2 text-center text-white transition-opacity duration-300'>
                    <span className='text-lg font-bold mb-1'>
                      Episode {ep.episode_number}
                    </span>
                    <span className='text-sm line-clamp-2'>{ep.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
