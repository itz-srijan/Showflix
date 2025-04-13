import { useRouter } from "next/navigation";
import Image from "next/image";
import { Result } from "postcss";

interface SearchResultsProps {
  results:
    | {
        media_type: string;
        id: number;
        poster_path: string;
        title: string;
        popularity: number;
      }[]
    | null;
  mediaType?: string;
  isPopular?: boolean;
}

const poster_URL = "https://image.tmdb.org/t/p/w300";

export default function SearchResults({
  results,
  mediaType,
  isPopular,
}: SearchResultsProps) {
  const router = useRouter();

  if (!results) return null;

  // Popular results
  if (isPopular) {
    return (
      <div className='px-6 py-4'>
        <h2 className='text-2xl font-bold text-white mb-4'>🔥 Popular</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {results.slice(0, 5).map((data) => (
            <div
              key={data.id}
              onClick={() => {
                router.push(
                  `/${data.media_type === "tv" ? "Series" : "Movie"}/${data.id}`
                );
              }}
              className='relative cursor-pointer group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'
            >
              <Image
                src={`${poster_URL}${data.poster_path}`}
                alt='Image not found'
                width={300}
                height={450}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2'>
                <p className='text-white text-sm font-medium truncate'>
                  {data.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter and render by media type (movie or tv)
  const filteredResults = results.filter(
    (data) => data.media_type === mediaType
  );

  if (filteredResults.length === 0) return null;

  return (
    <div className='px-6 py-4'>
      <h2 className='text-2xl font-bold text-white mb-4'>
        {mediaType === "tv" ? "📺 Series" : "🎬 Movies"}
      </h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
        {filteredResults.map((data) => (
          <div
            key={data.id}
            onClick={() => {
              router.push(
                `/${mediaType === "tv" ? "Series" : "Movie"}/${data.id}`
              );
            }}
            className='relative cursor-pointer group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'
          >
            <Image
              src={`${poster_URL}${data.poster_path}`}
              alt='Image not found'
              width={300}
              height={450}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2'>
              <div className='text-white text-sm font-medium truncate w-full'>
                {data.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
