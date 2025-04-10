"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/Components/Navbar";

export default function Play() {
  interface SeasonData {
    episodes: {
      episode_number: number;
      id: number;
      name: string;
      still_path: string;
    }[];
  }

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);

  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const seasonUrl = `https://api.themoviedb.org/3/tv/${params.id}/season/${season}?language=en-US&api_key=${apiKey}`;

  useEffect(() => {
    fetch(seasonUrl)
      .then((res) => res.json())
      .then((data) => {
        setSeasonData(data);
      });
  }, [seasonUrl]);

  const handleEpisodeClick = (epNumber: number) => {
    router.push(
      `/Series/${params.id}/play?season=${season}&episode=${epNumber}`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='bg-gray-800 min-h-screen'>
      <div className='pt-4 flex justify-center'>
        <div className='w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-lg'>
          <iframe
            key={`${params.id}-${season}-${episode}`} // 🔁 Key to force iframe re-render
            id='iframe'
            src={`https://iframe.pstream.org/embed/tmdb-tv-${params.id}/${season}/${episode}`}
            width='100%'
            height='100%'
            allowFullScreen
            allow='autoplay'
            className='w-full h-full object-cover'
          ></iframe>
        </div>
      </div>

      <div className='relative z-30 w-full px-4 sm:px-10 mt-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-white text-left mb-4'>
          Episodes :
        </h2>
        <div className='flex justify-center'>
          <div
            className='flex gap-4 sm:gap-6 overflow-x-auto pb-2'
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {seasonData?.episodes.map((ep) => (
              <div
                onClick={() => handleEpisodeClick(ep.episode_number)}
                key={ep.episode_number}
                className='relative min-w-[160px] sm:min-w-[200px] h-[120px] rounded-xl overflow-hidden shadow-md group cursor-pointer'
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                  alt={ep.name}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-2 text-center text-white transition-opacity duration-300'>
                  <span className='text-sm font-semibold mb-1'>
                    Episode {ep.episode_number}
                  </span>
                  <span className='text-xs line-clamp-2'>{ep.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
