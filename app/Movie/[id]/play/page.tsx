"use client";

import { useParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
export default function Play() {
  const params = useParams();
  //   console.log(params);
  return (
    <div>
      <Navbar />
      <div className='pt-10'>
        <iframe
          id='iframe'
          // src={`https://vidsrc.to/embed/movie/${result.id}`}
          // src={`https://embed.su/embed/movie/${result.id}`}
          src={`https://iframe.pstream.org/media/tmdb-movie-${params.id}`}
          width='100%'
          height='100%'
          // frameBorder="0"
          allowFullScreen
          allow='autoplay'
          className='aspect-video'
        ></iframe>
      </div>
    </div>
  );
}
