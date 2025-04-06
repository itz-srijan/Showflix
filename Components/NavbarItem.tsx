import React from "react";

interface NavbarItemProps {
  label: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ label }) => {
  return (
    <div className='text-white cursor-pointer px-4 py-1 hover:rounded-xl hover:bg-gray-800 transition duration-400 ease-in-out'>
      {label}
    </div>
  );
};

export default NavbarItem;
