import NavbarItem from "./NavbarItem";
import Image from "next/image";
import AccountMenu from "./AccountMenu";
import SearchButton from "./SearchButton";
import { IoMenu } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <nav className='w-screen z-50 fixed'>
        <div
          className={`fixed px-4 lg:px-10 py-3 flex items-center justify-between w-full top-0 z-50 transition-all duration-300 shadow-md border-b border-zinc-800 ${
            isScrolled ? "bg-black/50 backdrop-blur-lg" : "bg-black"
          }`}
        >
          {/* Logo and Mobile Menu Button */}
          <div className='flex items-center gap-4 min-w-[100px]'>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='lg:hidden text-white font-bold focus:outline-none'
            >
              {showMobileMenu ? (
                <FaChevronLeft className='h-6 w-6' />
              ) : (
                <IoMenu className='h-6 w-6' />
              )}
            </button>
            <Image
              className='cursor-pointer z-50 rounded shadow-sm hover:opacity-90 transition-opacity duration-200'
              src='/images/logo.jpg'
              alt='logo'
              width={90}
              height={28}
            />
          </div>

          {/* Centered Nav Items + Search */}
          <div className='hidden lg:flex flex-1 justify-center'>
            <div className='flex flex-row gap-6 items-center text-sm font-medium text-zinc-300'>
              <NavbarItem onClick={() => router.push("/")} label='Home' />
              <NavbarItem label='Movies' />
              <NavbarItem label='Series' />
              <NavbarItem label='Popular' />
              <NavbarItem onClick={()=> router.push("/watchlist")} label='Watchlist' />
              <SearchButton isMobile={false} />
            </div>
          </div>

          {/* Account Menu on Right */}
          <div className='flex items-center justify-end min-w-[120px]'>
            <AccountMenu />
          </div>
        </div>
      </nav>
      {showMobileMenu && <MobileMenu />}
    </div>
  );
}
