import { useState, useRef } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Card, CardContent } from "../ui/card";

interface SliderProps {
  sliderHeader: string;
  movieData:
    | {
        poster_path: string;
        title: string;
        genre_ids: number[];
      }[]
    | null;
}

export default function Slider({ sliderHeader, movieData }: SliderProps) {
  console.log(movieData);
  const poster_URL = "https://image.tmdb.org/t/p/w500";

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8; // Adjust scroll distance
      carouselRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className='relative w-full max-w-7xl mx-auto mt-4'>
      <h2 className='text-white text-2xl mb-3 font-semibold'>{sliderHeader}</h2>
      <div className='relative overflow-hidden'>
        <button
          className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white z-10'
          onClick={() => scroll("left")}
        >
          <BsChevronLeft size={24} />
        </button>

        <div
          ref={carouselRef}
          className='flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth px-6'
        >
          {/* {movies.map((movie) => (
            <div key={movie.id} className="relative w-[150px] md:w-[200px] shrink-0">
              <img
                src={`${IMAGE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
              />
            </div>
          ))} */}
          {movieData?.map((movie, index) => (
            <div
              key={movie.title + index}
              className='relative w-[150px] md:w-[200px] shrink-0'
            >
              <img
                src={`${poster_URL}${movie.poster_path}`}
                alt={movie.title}
                className='w-full h-auto rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl'
              />
            </div>
          ))}
        </div>

        <button
          className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white z-10'
          onClick={() => scroll("right")}
        >
          <BsChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
