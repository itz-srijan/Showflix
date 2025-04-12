// utils/getTrailer.ts
export async function getYoutubeTrailerKey(
  id: number,
  mediaType: "movie" | "tv"
) {
  const res = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();

  const trailer = data.results.find(
    (video: { type: string; site: string }) => video.type === "Trailer" && video.site === "YouTube"
  );

  return trailer?.key || null;
}
