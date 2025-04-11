import { useRef, useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";
import { useGenre } from "@/context/GenreContext";
import ShowGenreMovieDetail from "./ShowGenreMovieDetail";

type Genre = {
  id: number;
  name: string;
};

export default function GenreCarousel() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { genres } = useGenre();

  const checkScroll = () => {
    const slider = sliderRef.current;
    if (slider) {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    checkScroll();
    slider.addEventListener("scroll", checkScroll);
    return () => slider.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const slider = sliderRef.current;
    if (slider) {
      const { scrollLeft, clientWidth } = slider;
      const scrollBy = clientWidth * 0.8;
      slider.scrollTo({
        left: dir === "left" ? scrollLeft - scrollBy : scrollLeft + scrollBy,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className='relative'>
      <div className='relative w-full max-w-7xl mx-auto mt-8 px-6'>
        <h2 className='text-white text-2xl font-bold mb-4'>Browse by Genre</h2>

        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className={`absolute z-10 left-4 top-[65%] -translate-y-1/2 h-8 w-8 rounded-full text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition ${
            canScrollLeft ? "visible" : "invisible"
          }`}
        >
          <BsChevronLeft size={24} />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className={`absolute z-10 right-4 top-[65%] -translate-y-1/2 h-8 w-8 rounded-full text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition ${
            canScrollRight ? "visible" : "invisible"
          }`}
        >
          <BsChevronRight size={24} />
        </button>

        {/* Genre Cards */}
        <div
          ref={sliderRef}
          className='flex gap-4 overflow-x-scroll py-2 scroll-smooth px-2 scrollbar-hide'
        >
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => {
                setGenre(genre);
                setIsOpen(true);
              }}
              className='min-w-[140px] h-[100px] flex items-center justify-center rounded-xl font-semibold text-white cursor-pointer bg-gradient-to-br from-indigo-800 to-purple-800 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
            >
              {genre.name}
            </div>
          ))}
        </div>
      </div>

      {/* Animated Genre Detail Overlay */}
      {isOpen && genre && (
        <div onClick={() => setIsOpen(false)}
        className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300'>
          <div  onClick={(e) => e.stopPropagation()} className='relative bg-gray-900 rounded-xl p-6 w-[90%] max-w-5xl h-[80%] overflow-y-auto scrollbar-hide animate-slideIn shadow-2xl'>
            {/* Close Button */}
            <button
              className='absolute top-4 right-4 text-white text-2xl hover:text-red-500 transition'
              onClick={() => setIsOpen(false)}
            >
              <BsX size={28} />
            </button>

            <ShowGenreMovieDetail genre={genre} />
          </div>
        </div>
      )}

<style jsx global>{`
  @keyframes slideIn {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slideIn {
    animation: slideIn 0.4s ease-out forwards;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;    /* Firefox */
  }
`}</style>

    </div>
  );
}
