import NavbarItem from "./NavbarItem";
import Image from "next/image";
import AccountMenu from "./AccountMenu";
import SearchButton from "./SearchButton";
import { IoMenu } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className='max-w-screen max-h-20 w-screen z-50 fixed'>
        <div
          className={`fixed px-0 lg:px-4 py-4 flex justify-between w-full top-0 z-50 transition-colors duration-300 ${
            isScrolled ? "bg-black/80" : "bg-black"
          }`}
        >
          <div className='flex flex-row gap-4 items-center'>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='lg:hidden text-white font-bold'
            >
              {showMobileMenu ? (
                <FaChevronLeft className='h-8 w-10' />
              ) : (
                <IoMenu className='h-8 w-10' />
              )}
            </button>
            <Image
              className='cursor-pointer z-50 shadow-sm shadow-gray-400/50'
              src='/images/logo.jpg'
              alt='logo'
              width={100}
              height={100}
            />
          </div>

          <div className='hidden lg:flex flex-row gap-3 items-center'>
            <NavbarItem label='Home' />
            <NavbarItem label='Movies' />
            <NavbarItem label='Series' />
            <NavbarItem label='Popular' />
            <NavbarItem label='My List' />
            <div className='px-4'>
              <SearchButton isMobile={false} />
            </div>
          </div>
          <AccountMenu />
        </div>
      </nav>
      {showMobileMenu && <MobileMenu />}
    </div>
  );
}
