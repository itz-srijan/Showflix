interface NavbarItemProps {
  label: string;
  onClick?: () => void;
}

export default function NavbarItem({ label, onClick }: NavbarItemProps) {
  return (
    <div
      className='text-white cursor-pointer px-4 py-1 hover:rounded-xl hover:bg-gray-800 transition duration-400 ease-in-out'
      role='button'
      onClick={onClick}
    >
      {label}
    </div>
  );
}
