import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FaPlay, FaPlus } from "react-icons/fa";
import { useGenre } from "@/context/GenreContext";
import Image from "next/image";

interface CarouselProps {
  trendingMovieData:
    | {
        backdrop_path: string;
        poster_path: string;
        title: string;
        genre_ids: number[];
        overview: string;
        media_type: string;
      }[]
    | undefined;
}

export default function TrendingCarousel({ trendingMovieData }: CarouselProps) {
  const IMAGE_URL = "https://image.tmdb.org/t/p/original/";
  const poster_URL = "https://image.tmdb.org/t/p/w500";
  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(genreList);
  // useEffect(() => {
  //   if (!trendingMovieData || trendingMovieData.length === 0) return; // Ensure effect runs only when trendingMovieData exist

  //   // const interval = setInterval(() => {
  //   //   setCurrentIndex((prev) => (prev === trendingMovieData.length - 1 ? 0 : prev + 1));
  //   // }, 5000);

  //   // return () => clearInterval(interval);
  // }, [trendingMovieData?.length]); // Depend only on trendingMovieData.length to prevent re-renders

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? trendingMovieData!.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === trendingMovieData!.length - 1 ? 0 : prev + 1
    );
  };

  //getting genre name from genre id
  const { movieIdToGenre } = useGenre();
  const genreName: string[] = [];
  if (trendingMovieData && trendingMovieData.length > 0) {
    trendingMovieData[currentIndex].genre_ids.forEach((id) => {
      const gnr = movieIdToGenre(id);
      if (gnr.length > 0) {
        genreName.push(gnr);
      }
    });
  }
  const shortOverview = (overview: string) => {
    return overview.length > 200 ? `${overview.slice(0, 200)}...` : overview;
  };

  if (!trendingMovieData || trendingMovieData.length === 0) {
    return <div>No trendingMovieData available</div>;
  }

  const overview = trendingMovieData[currentIndex].overview;
  return (
    <div className='relative'>
      <div
        className='h-screen max-w-screen relative bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${IMAGE_URL}${trendingMovieData[currentIndex].backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className='absolute inset-0 bg-black/60'></div>

        <div className='absolute top-[40%] left-16 transform -translate-y-1/2 text-white space-y-4 flex flex-col max-w-2xl'>
          <h1 className='text-4xl w-fit font-bold text-center rounded-lg shadow-2xl px-2 bg-gray-700/20 shadow-black'>
            {trendingMovieData[currentIndex].title}
          </h1>
          <div className='flex flex-row flex-wrap gap-2 mt-4 px-1'>
            {genreName &&
              genreName.map((genre, index) => (
                <div
                  key={index}
                  className='bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md '
                >
                  {genre}
                </div>
              ))}
          </div>
          <div className='mt-2'>
            <p className='text-lg text-white text-pretty italic font-light'>
              {shortOverview(overview || "")}
            </p>
          </div>
        </div>
        <div className='absolute top-[60%] mt-4 left-16 transform -translate-y-1/2 flex space-x-4'>
          <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlay /> Play
          </button>
          <button className='flex items-center gap-2 bg-gray-600 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlay /> Trailer
          </button>
          <button className='flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-lg font-semibold'>
            <FaPlus />
          </button>
        </div>
        {/* Left Button */}
        <button
          className='flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 text-white text-2xl rounded-full bg-black/25 cursor-pointer p-2'
          onClick={prevSlide}
        >
          <BsChevronLeft />
        </button>

        {/* Right Button */}
        <button
          className='flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 text-white text-2xl rounded-full bg-black/25 cursor-pointer p-2'
          onClick={nextSlide}
        >
          <BsChevronRight />
        </button>
        {/* Next 4 Movie Posters */}
        <div className='absolute bottom-4 right-4 flex space-x-4'>
          {trendingMovieData
            .slice(currentIndex + 1, currentIndex + 5)
            .map((movie, index) => (
              <div
                key={index}
                className='w-24 h-36 bg-white text-black text-sm font-bold flex items-center justify-center rounded-lg shadow-lg border-2 border-gray-300 transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
              >
                <Image
                  src={`${poster_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className='h-full w-full object-cover rounded-lg'
                  width={96}
                  height={144}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
