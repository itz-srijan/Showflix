import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { useGenre } from "@/context/GenreContext";

interface CarouselProps {
  trendingMovieData:
    | {
        backdrop_path: string;
        poster_path: string;
        title: string;
        genre_ids: number[];
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

  const handleDotClick = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  //getting genre name from genre id
  const { movieIdToGenre } = useGenre();
  let genreName: string[] = [];
  trendingMovieData &&
    trendingMovieData[currentIndex].genre_ids.forEach((id) => {
      let gnr = movieIdToGenre(id);

      gnr.length > 0 && genreName.push(gnr);
    });

  if (!trendingMovieData || trendingMovieData.length === 0) {
    return <div>No trendingMovieData available</div>;
  }

  return (
    <div className='relative mx-auto group w-full max-w-6xl'>
      {/* Flex Container */}
      <div className='flex gap-5 w-full '>
        {/* Left Div (30%) - poster*/}
        <div className='w-[20%] h-[270px] bg-white text-black text-2xl font-bold flex items-center justify-center rounded-lg shadow-lg  border-4 border-gray-300 transition-transform duration-300 hover:scale-105 hover:shadow-2xl'>
          <img
            src={`${poster_URL}${trendingMovieData[currentIndex].poster_path}`}
            alt=''
            className='h-full w-full static'
          />
        </div>

        {/* Right Div (70%) - image */}
        <div className='w-[80%] h-[270px] relative  duration-300 ease-in-out rounded-lg group'>
          {/* <img
            src={}
            alt={trendingMovieData[currentIndex].title || "No data"}
            
          /> */}
          <div
            style={{
              backgroundImage: `url(${IMAGE_URL}${trendingMovieData[currentIndex].backdrop_path})`,
            }}
            className='w-full h-full bg-cover bg-center p-1 rounded-lg'
          >
            <div className='flex flex-row flex-wrap justify-end w-auto p-2 rounded-lg'>
              {genreName &&
                genreName.map((genre, index) => (
                  <div
                    key={index}
                    className='bg-black/70 text-white text-base p-2 rounded-lg m-1'
                  >
                    <p>{genre}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Left Button */}
          <button
            className='hidden group-hover:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 text-white text-2xl rounded-full bg-black/25 cursor-pointer p-2'
            onClick={prevSlide}
          >
            <BsChevronLeft />
          </button>

          {/* Right Button */}
          <button
            className='hidden group-hover:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 text-white text-2xl rounded-full bg-black/25 cursor-pointer p-2'
            onClick={nextSlide}
          >
            <BsChevronRight />
          </button>
        </div>
      </div>

      {/* Slider Dots */}
      <div className='flex justify-center mt-[1%]'>
        {trendingMovieData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={` text-white text-xl cursor-pointer transition ${
              currentIndex === index
                ? "text-gray-300 scale-125"
                : "text-gray-500"
            }`}
          >
            <RxDotFilled />
          </button>
        ))}
      </div>
    </div>
  );
}
