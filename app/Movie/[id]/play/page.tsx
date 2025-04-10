"use client";

import { useParams } from "next/navigation";
export default function Play() {
  const params = useParams();
  //   console.log(params);
  return (
    <div className='bg-gray-800 min-h-screen'>
      <div className='pt-4 flex justify-center'>
        <div className='w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-lg'>
          <iframe
            id='iframe'
            src={`https://iframe.pstream.org/media/tmdb-movie-${params.id}`}
            width='100%'
            height='100%'
            allowFullScreen
            allow='autoplay'
            className='w-full h-full object-cover'
          ></iframe>
        </div>
      </div>
    </div>
  );
}
