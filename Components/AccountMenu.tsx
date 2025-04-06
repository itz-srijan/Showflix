import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    signOut();
    router.push("/auth");
  };

  const handleWatchlist = () => {
    router.push("/watchlist");
  };

  return (
    <div ref={menuRef} className='relative flex items-center text-white'>
      <div
        className='flex items-center cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img
          src={session?.user?.image || "/default-user.png"}
          alt='User Profile'
          className='w-10 h-10 rounded-full mr-2 hover:scale-105 transition-transform shadow-md'
        />
      </div>

      {isExpanded && (
        <div className="fixed top-16 right-4 w-72 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl z-50 overflow-hidden border border-gray-600 animate-fadeIn">
          <div className="px-5 py-4 border-b border-gray-600">
            <p className="text-xs text-gray-400 mb-1">Signed in as</p>
            <p className="text-base font-semibold text-white truncate">
              {session?.user?.name || "Guest"}
            </p>
          </div>
          <div className="flex flex-col divide-y divide-gray-700">
            <button
              onClick={handleWatchlist}
              className="flex items-center gap-3 w-full px-5 py-4 text-white hover:bg-gray-700 transition-all"
            >
              <MdOutlineFeaturedPlayList size={20} />
              <span className="text-sm font-medium">My List</span>
            </button>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-3 w-full px-5 py-4 text-red-400 hover:bg-gray-700 transition-all"
            >
              <CiLogout size={20} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
