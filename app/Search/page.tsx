"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchResults from "@/Components/SearchResults";
import { MdPersonSearch } from "react-icons/md";
import Navbar from "@/Components/Navbar";

interface SearchData {
  results: {
    media_type: string;
    id: number;
    poster_path: string;
    name: string;
    popularity: number;
    vote_count: number;
    profile_path?: string;
  }[];
}

const Search: React.FC = () => {
  const params = useSearchParams();
  const query = params.get("query");
  //   console.log(query);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const searchUrl: string = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;

  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isFilterOn, setIsFilterOn] = useState(false);

  useEffect(() => {
    fetch(searchUrl)
      .then((res) => res.json())
      .then((data) => {
        setSearchData(data);
        console.log(data);
      });
  }, [searchUrl]);

  searchData?.results.sort(
    (a, b) => b.popularity * b.vote_count - a.popularity * a.vote_count
  );

  return (
    <div>
      {/* <Navbar/> */}
      <div className="relative min-h-screen bg-[url('/images/background.jpg')] bg-no-repeat bg-center bg-cover bg-fixed text-white">
      <div className='flex flex-row justify-between p-2 bg-gray-700/50'>
        <div className="text-4xl font-semibold">Search Results for : {query}</div>
        <div
          onClick={() => setIsFilterOn(!isFilterOn)}
          className='cursor-pointer'
        >
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            <MdPersonSearch className='h-7 w-7' />
          </button>
        </div>
      </div>
      {isFilterOn ? (
        <div>
          <SearchResults
            results={searchData?.results ?? null}
            mediaType='person'
          />
        </div>
      ) : (
        <div>
          <SearchResults
            results={searchData?.results ?? null}
            isPopular={true}
          />
          <SearchResults
            results={searchData?.results ?? null}
            mediaType='movie'
          />
          <SearchResults results={searchData?.results ?? null} mediaType='tv' />
        </div>
      )}
    </div>
    </div>

    
  );
};

export default Search;
