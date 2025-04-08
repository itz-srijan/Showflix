import SearchButton from "./SearchButton";

const MobileMenu = () => {
  return (
    <div className='absolute top-14 left-0 w-full z-50 bg-black/90 backdrop-blur-sm shadow-lg px-6 pt-6 pb-10 rounded-b-xl'>
      <SearchButton isMobile={true} />

      <div className='flex flex-col gap-3 mt-6 text-lg font-medium text-white'>
        {["Home", "Movies", "Series", "Popular", "My List"].map((item) => (
          <div
            key={item}
            className='text-center py-2 px-4 rounded-lg bg-zinc-800/60 hover:bg-blue-500/80 transition duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer'
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
