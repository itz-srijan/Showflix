import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const router = useRouter();

  const handleLogOut = () => {
    signOut();
    router.push("/auth");
  };

  return (
    <div className='bg-black flex text-white p-2'>
      <button onClick={handleLogOut}>SignOut</button>
    </div>
  );
};

export default AccountMenu;
