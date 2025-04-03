import NavbarItem from "./NavbarItem";
import { BsBell, BsChevronDown, BsSearch } from "react-icons/bs";
import MobileMenu from "./MobileMenu";
import AccountMenu from "./AccountMenu";
import SearchButton from "./SearchButton";
import { useCallback, useState } from "react";

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  return (
    <nav className='w-full z-40'>
      <div className='px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 bg-zinc-900 bg-opacity-90'>
        {/* Logo */}
        <img className='h-4 lg:h-7' src='/images/logo.jpg' alt='logo' />

        {/* Navigation Items (Visible only on large screens) */}
        <div className='hidden lg:flex flex-row gap-7 ml-8'>
          <NavbarItem label='Home' />
          <NavbarItem label='Series' />
          <NavbarItem label='Films' />
          <NavbarItem label='New & Popular' />
          <NavbarItem label='My List' />
          <NavbarItem label='Browse by Language' />
        </div>

        {/* "Browse" Button (Visible only on small screens) */}
        <div
          onClick={toggleMobileMenu}
          className='lg:hidden flex flex-row items-center gap-4 ml-8 cursor-pointer'
        >
          <p className='text-white text-sm'>Browse</p>
          <BsChevronDown
            className={`text-white text-sm transition ${
              showMobileMenu ? "rotate-180" : "rotate-0"
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>
        <div className='flex flex-row gap-7 ml-auto items-center'>
          <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
            <SearchButton />
          </div>
          <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
            <BsBell />
          </div>
          <div
            onClick={toggleAccountMenu}
            className='flex flex-row items-center gap-2 cursor-pointer relative'
          >
            <div className='w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden'>
              <img src='/images/user.jpg' alt='user' />
            </div>
            <BsChevronDown
              className={`text-white text-sm transition ${
                showAccountMenu ? "rotate-180" : "rotate-0"
              }`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
}
