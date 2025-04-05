"use client";

import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";

interface SearchButtonProps {
  isMobile: boolean;
}

const SearchButton = ({ isMobile }: SearchButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/Search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const searchbarClassName = isExpanded
    ? "rounded-full flex justify-between border border-gray-300"
    : "flex justify-between";
    
  return isMobile ? (
    <div className='py-1 px-3'>
      <div className='rounded-full flex justify-between text-white bg-blue-500/50 px-1 z-30 shadow-lg shadow-blue-300/30 transition-shadow duration-300'>
        <input
          type='text'
          className='text-white bg-transparent outline-none transition-all duration-300 p-2'
          placeholder='Search...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            handleSearch();
          }}
          className='text-white font-bold px-2'
        >
          <IoIosSearch className='h-6 w-6 cursor-pointer hover:text-blue-300' />
        </button>
      </div>
    </div>
  ) : (
    <div className='px-2 transition-all duration-300 ease-in-out max-w-xs'>
      <div className={searchbarClassName}>
        {isExpanded && (
          <input
            type='text'
            className='bg-transparent outline-none transition-all duration-300 ease-in-out w-40 sm:w-60 px-2 py-1'
            placeholder='Search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            handleSearch();
          }}
          className='p-2 text-white font-bold'
        >
          <IoIosSearch className='h-6 w-6 cursor-pointer hover:text-blue-300' />
        </button>
      </div>
    </div>
  );
};

export default SearchButton;
