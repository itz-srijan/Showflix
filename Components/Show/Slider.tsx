import { useState, useRef } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface SliderProps {
  sliderHeader: string;
  movieData:
    | {
        id: number;
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

  const router = useRouter();

  return (
    <div
      className='relative w-full max-w-7xl mx-auto mt-4 cursor-grab [-webkit-user-drag:none]'
      style={{ userSelect: "none" }}
      onMouseDown={(e) => {
        const carousel = carouselRef.current;
        if (carousel) {
          carousel.style.scrollBehavior = "auto";
          let startX = e.pageX - carousel.offsetLeft;
          let scrollLeft = carousel.scrollLeft;

          const onMouseMove = (event: MouseEvent) => {
            const x = event.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 0.5; // Adjust scroll speed
            carousel.scrollLeft = scrollLeft - walk;
          };

          const onMouseUp = () => {
            carousel.style.scrollBehavior = "smooth";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }
      }}
    >
      <h2 className='text-white text-2xl mb-3 font-semibold'>{sliderHeader}</h2>
      <div className='relative overflow-hidden '>
        <button
          className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white z-10'
          onClick={() => scroll("left")}
        >
          <BsChevronLeft size={24} />
        </button>

        <button
          className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full text-white z-10'
          onClick={() => scroll("right")}
        >
          <BsChevronRight size={24} />
        </button>
        <div
          ref={carouselRef}
          className='flex gap-4 overflow-x-scroll overflow-y-hidden scroll-smooth px-6'
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Hide scrollbar for Webkit browsers */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {movieData?.map((movie, index) => (
            <div
              onClick={() => router.push(`/Series/${movie.id}`)}
              key={movie.title + index}
              className='relative w-[150px] md:w-[200px] shrink-0'
            >
              <img
                src={`${poster_URL}${movie.poster_path}`}
                alt={movie.title}
                draggable={false}
                className='w-full h-auto rounded-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-xl hover:p-2'
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
