import SearchButton from "./SearchButton";

const MobileMenu = () => {
  return (
    <div className='h-auto bg-black/90 w-auto absolute left-0 pt-4 pb-10 flex flex-col z-50'>
      <SearchButton isMobile={true} />
      <div className='flex flex-col gap-2 mt-5 text-lg px-2'>
        <div className='hover:border-2 hover:rounded-xl px-2 text-center text-white hover:bg-blue-500/60 hover:z-30 hover:shadow-lg hover:transition-shadow hover:duration-300'>
          Home
        </div>
        <div className='hover:border-2 hover:rounded-xl px-2 text-center text-white hover:bg-blue-500/60 hover:z-30 hover:shadow-lg hover:transition-shadow hover:duration-300'>
          Movies
        </div>
        <div className='hover:border-2 hover:rounded-xl px-2 text-center text-white hover:bg-blue-500/60 hover:z-30 hover:shadow-lg hover:transition-shadow hover:duration-300'>
          Series
        </div>
        <div className='hover:border-2 hover:rounded-xl px-2 text-center text-white hover:bg-blue-500/60 hover:z-30 hover:shadow-lg hover:transition-shadow hover:duration-300'>
          Popular
        </div>
        <div className='hover:border-2 hover:rounded-xl px-2 text-center text-white hover:bg-blue-500/60 hover:z-30 hover:shadow-lg hover:transition-shadow hover:duration-300'>
          My List
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
