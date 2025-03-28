import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  if (!visible) return null;

  const router = useRouter();
  
    const handleLogOut = () => {
      signOut();
      router.push("/auth");
    }
    
  return (
    <div className='bg-black w-56 absolute top-8 left-0 py-5 flex-col border-2 border-gray-800 flex'>
        <div className="flex flex-col gap-3">
            <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
            <img className="w-8 rounded-md" src="/images/user.jpg" alt="user" />   
            <p className="text-white text-sm group-hover/item:underline">Username</p> 
            <hr className="bg-gray-600 border-0 h-px my-4"/> 
            </div>
            <div onClick={handleLogOut} className="px-3 text-center text-white text-sm hover:underline">Sign Out</div>
        </div>
    </div>
  );
};

export default AccountMenu;


