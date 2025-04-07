import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchResultsProps {
  results:
    | {
        media_type: string;
        id: number;
        poster_path: string;
        name: string;
        popularity: number;
        profile_path?: string;
      }[]
    | null;
  mediaType?: string;
  isPopular?: boolean;
}
const poster_URL = "https://image.tmdb.org/t/p/w300";
const profile_url = "https://image.tmdb.org/t/p/w300";

export default function SearchResults({
  results,
  mediaType,
  isPopular,
}: SearchResultsProps) {
  const router = useRouter();

  if (results == null) return;
  // for top popular search results
  if (isPopular) {
    return (
      <div className="p-4 mt-2">
        <div className="text-xl p-1">POPULAR</div>
        <div className='grid grid-cols-5 gap-5 p-1'>
          {results.slice(0, 5).map((data) => (
            <Image
              key={data.id}
              src={
              mediaType === "person"
                ? `${profile_url}${data.profile_path}`
                : `${poster_URL}${data.poster_path}`
              }
              alt={data.name || "Image not available"}
              draggable={false}
              width={300}
              height={450}
              className='relative overflow-hidden rounded-lg group cursor-pointer w-full h-full transform transition-transform duration-300 group-hover:scale-105'
            />
          ))}
        </div>
      </div>
    );
  }
  // for other search results
  return (
    <div className="p-4 mt-2">
      {results.some((data) => data.media_type === mediaType) && (
        <div className="text-xl p-1">{mediaType === "tv" ? "SERIES" : mediaType?.toLocaleUpperCase()}</div>
      )}
      <div className='grid grid-cols-7 gap-4 mt-2'>
        {results
          .filter((data) => data.media_type === mediaType)
          .map((data) =>
            data == null ? (
              <div key={`no-result-${mediaType}`}>No search result found in {mediaType}</div>
            ) : (
              <div
                key={data.id}
                onClick={() => {
                  const id = data.id;
                  switch (data.media_type) {
                    case "movie":
                      router.push(`Movie/${id}`);
                      break;
                    case "tv":
                      router.push(`Series/${id}`);
                      break;
                    default:
                      break;
                  }
                }}
                className='relative overflow-hidden rounded-lg group cursor-pointer'
              >
                  <Image
                    src={
                    mediaType === "person"
                      ? `${profile_url}${data.profile_path}`
                      : `${poster_URL}${data.poster_path}`
                    }
                    alt="Image not available"
                    draggable={false}
                    width={300}
                    height={450}
                    className='w-full h-full rounded-lg transform transition-transform duration-300 group-hover:scale-105'
                  />
                <div className='absolute inset-0 bg-blue-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='text-white text-lg font-semibold'>
                    <p>{data.name}</p>
                    <p>{data.popularity}</p>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
