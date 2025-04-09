import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface SliderProps {
  sliderHeader: string;
  media_type: string;
  movieData:
    | {
        id: number;
        poster_path: string;
        title: string;
        genre_ids: number[];
      }[]
    | null;
}

export default function Slider({
  sliderHeader,
  media_type,
  movieData,
}: SliderProps) {
  const poster_URL = "https://image.tmdb.org/t/p/w500";
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = () => {
    const carousel = carouselRef.current;
    if (carousel) {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Initial check
    checkScrollPosition();

    // Listener on scroll
    carousel.addEventListener("scroll", checkScrollPosition);

    // Cleanup
    return () => {
      carousel.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (carousel) {
      const { scrollLeft, clientWidth } = carousel;
      const scrollAmount = clientWidth * 0.8;
      carousel.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const router = useRouter();
  const goToShowDetailsHandler = (id: number) => {
    router.push(media_type === "movie" ? `/Movie/${id}` : `/Series/${id}`);
  };

  return (
    <div
      className='relative w-full max-w-7xl mx-auto mt-8 select-none'
      onMouseDown={(e) => {
        const carousel = carouselRef.current;
        if (carousel) {
          carousel.style.scrollBehavior = "auto";
          const startX = e.pageX - carousel.offsetLeft;
          const scrollLeft = carousel.scrollLeft;

          const onMouseMove = (event: MouseEvent) => {
            const x = event.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 0.5;
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
      <h2 className='text-white text-2xl font-bold mb-4 px-6'>
        {sliderHeader}
      </h2>

      <div className='relative overflow-hidden font-bold'>
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className='absolute left-2 top-1/2 -translate-y-1/2 h-12 w-8 bg-black/60 hover:bg-black/80 text-white z-20 flex items-center justify-center rounded-md shadow-md transition-all duration-300'
            onClick={() => scroll("left")}
          >
            <BsChevronLeft size={22} />
          </button>
        )}
        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className='absolute right-2 top-1/2 -translate-y-1/2 h-12 w-8 bg-black/60 hover:bg-black/80 text-white z-20 flex items-center justify-center rounded-md shadow-md transition-all duration-300'
            onClick={() => scroll("right")}
          >
            <BsChevronRight size={22} />
          </button>
        )}
        <div
          ref={carouselRef}
          className='flex gap-4 overflow-x-scroll overflow-y-hidden scroll-smooth px-6 py-2'
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {movieData?.map((movie) => (
            <div
              key={movie.id}
              className='relative group w-[150px] md:w-[200px] shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 hover:scale-105 cursor-pointer'
              onClick={() => goToShowDetailsHandler(movie.id)}
            >
              <Image
                src={`${poster_URL}${movie.poster_path}`}
                alt={movie.title}
                draggable={false}
                width={200}
                height={300}
                className='w-full h-full object-cover rounded-xl'
              />
              <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
