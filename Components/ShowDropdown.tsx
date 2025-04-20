import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGenre } from "@/context/GenreContext";

export default function ShowDropdown({ type }: { type: string }) {
  const router = useRouter();
  const { genres } = useGenre();

  const categories = ["Popular", "Top Rated", "Now Playing"];

  const cardClass =
    "whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.03] active:scale-[0.97] px-4 py-2 rounded-xl text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ease-in-out font-medium text-sm sm:text-base";

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      }}
      className='absolute top-11 -left-12 w-[90vw] max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 px-6 py-6 backdrop-blur-lg'
    >
      <h3 className='text-xl font-semibold text-white mb-4 tracking-wide'>
        Browse {type === "movie" ? "Movies" : "Series"}
      </h3>

      {/* Categories - Horizontal Scroll */}
      <div className='mb-6 border-b-2'>
        {/* <h4 className='text-white text-base font-semibold mb-2'>Categories</h4> */}
        <div className='flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent'>
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                router.push(
                  `/${type}?category=${item.toLowerCase().replace(" ", "_")}`
                )
              }
              className={cardClass}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Genres - Grid */}
      <div>
        {/* <h4 className='text-white text-base font-semibold mb-2'>Genres</h4> */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {genres
            .filter((genre) => genre.name !== "TV Movie")
            .map((genre) => (
              <div
                key={genre.id}
                onClick={() => router.push(`/${type}?genre=${genre.id}`)}
                className='bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.03] active:scale-[0.97] px-4 py-2 rounded-xl text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ease-in-out font-medium text-sm sm:text-base text-white'
              >
                {genre.name}
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
