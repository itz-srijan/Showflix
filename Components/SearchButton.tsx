"use client";

import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";

const SearchButton = () => {
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

  return (
    <div className='flex items-center gap-2  px-2 transition-all duration-300 ease-in-out max-w-xs'>
      {isExpanded && (
        <div className='rounded-full border border-gray-300'>
          <input
            type='text'
            className='bg-transparent outline-none transition-all duration-300 ease-in-out w-40 sm:w-60 px-2 py-1'
            placeholder='Search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          handleSearch();
        }}
        className='p-2 text-white font-bold'
      >
        <IoIosSearch className='h-6 w-6 cursor-pointer' />
      </button>
    </div>
  );
};

export default SearchButton;
