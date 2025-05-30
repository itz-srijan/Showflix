import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useGenre } from "@/context/GenreContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getYoutubeTrailerKey } from "@/lib/getTrailer";
import TrailerModal from "../TrailerModal";

interface CarouselProps {
  trendingMovieData:
    | {
        backdrop_path: string;
        poster_path: string;
        title: string;
        genre_ids: number[];
        overview: string;
        media_type: string;
        id: number;
      }[]
    | undefined;
}

export default function TrendingCarousel({ trendingMovieData }: CarouselProps) {
  const IMAGE_URL = "https://image.tmdb.org/t/p/original/";
  const poster_URL = "https://image.tmdb.org/t/p/w500";
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const { movieIdToGenre } = useGenre();

  const handleSlideChange = (direction: "prev" | "next") => {
    if (!trendingMovieData) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? trendingMovieData.length - 1
            : prev - 1
          : prev === trendingMovieData.length - 1
          ? 0
          : prev + 1
      );
      setTransitioning(false);
    }, 300);
  };

  const genreName: string[] = [];

if (
  Array.isArray(trendingMovieData) &&
  trendingMovieData.length > 0 &&
  trendingMovieData[currentIndex] &&
  Array.isArray(trendingMovieData[currentIndex].genre_ids)
) {
  trendingMovieData[currentIndex].genre_ids.forEach((id) => {
    const gnr = movieIdToGenre(id);
    if (gnr.length > 0) {
      genreName.push(gnr);
    }
  });
}


  const goToShowDetailsHandler = (id: number, media_type: string) => {
    router.push(media_type === "movie" ? `/Movie/${id}` : `/Series/${id}`);
  };

  const currentMovie = trendingMovieData?.[currentIndex];
  // to show trailer
  const [youtubeKey, setYoutubeKey] = useState<string | null>(null);

  const handleTrailerClick = async () => {
    if (currentMovie) {
      const key = await getYoutubeTrailerKey(
        currentMovie.id,
        currentMovie.media_type as "movie" | "tv"
      );
      if (key) {
        setYoutubeKey(key);
      } else {
        alert("Trailer not available");
      }
    }
  };

  const shortOverview = (overview: string) =>
    overview.length > 200 ? `${overview.slice(0, 200)}...` : overview;

  if (!trendingMovieData || trendingMovieData.length === 0) {
    return <div>No trendingMovieData available</div>;
  }

  return (
    <div className='relative mt-12 h-[90vh] w-full overflow-hidden rounded-b-3xl shadow-2xl'>
      {/* Background */}
      <div className='absolute inset-0 z-0'>
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${IMAGE_URL}${currentMovie?.backdrop_path})`,
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent' />
      </div>
      {/* showing trailer */}
      {youtubeKey && (
        <TrailerModal
          youtubeKey={youtubeKey}
          onClose={() => setYoutubeKey(null)}
        />
      )}
      {/* Foreground */}
      <div className='relative z-10 h-full w-full pt-16 lg:pt-24'>
        <div className='absolute top-[40%] transform -translate-y-1/2 left-6 lg:left-20 text-white space-y-6 max-w-xl lg:max-w-2xl px-4'>
          <h1 className='text-4xl lg:text-5xl font-extrabold leading-snug bg-gradient-to-r from-white to-zinc-300 text-transparent bg-clip-text drop-shadow-2xl'>
            {currentMovie?.title}
          </h1>

          <div className='flex flex-wrap gap-2'>
            {genreName.map((genre, index) => (
              <span
                key={index}
                className='bg-red-600 text-white text-xs lg:text-sm font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md'
              >
                {genre}
              </span>
            ))}
          </div>

          <p className='text-base lg:text-lg text-white/90 italic font-light leading-relaxed drop-shadow-md max-w-xl line-clamp-4'>
            {shortOverview(currentMovie?.overview ?? "")}
          </p>

          <div className='flex flex-wrap items-center gap-4 mt-4'>
            <button
              onClick={() =>
                currentMovie &&
                goToShowDetailsHandler(currentMovie.id, currentMovie.media_type)
              }
              className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-36 h-11 rounded-xl text-sm lg:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105'
            >
              <FaEye /> Watch
            </button>
            <button
              onClick={handleTrailerClick}
              className='flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white w-36 h-11 rounded-xl text-sm lg:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105'
            >
              <FaPlay /> Trailer
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className='absolute top-1/2 -translate-y-1/2 left-4 text-white text-2xl rounded-full bg-black/50 hover:bg-black/70 p-2 transition duration-300 z-10'
          onClick={() => handleSlideChange("prev")}
        >
          <BsChevronLeft />
        </button>
        <button
          className='absolute top-1/2 -translate-y-1/2 right-4 text-white text-2xl rounded-full bg-black/50 hover:bg-black/70 p-2 transition duration-300 z-10'
          onClick={() => handleSlideChange("next")}
        >
          <BsChevronRight />
        </button>

        {/* Thumbnail Slider */}
        <div className='hidden md:block absolute bottom-6 right-6 overflow-hidden w-[300px] lg:w-[400px] h-36 z-10 rounded-xl shadow-inner bg-black/30 backdrop-blur-md p-2'>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${currentIndex * 104}px)` }}
          >
            {trendingMovieData.map((movie, index) => (
              <div
                key={index}
                onClick={() =>
                  goToShowDetailsHandler(movie.id, movie.media_type)
                }
                className='w-24 h-36 mr-3 flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:scale-110 transition-transform duration-300 cursor-pointer'
              >
                <Image
                  src={`${poster_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className='h-full w-full object-cover'
                  width={96}
                  height={144}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
