"use client";

import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();

  const handleLogOut = () => {
    signOut();
    router.push("/auth");
  }
  return (
    <div>
      hello next JS
      <button onClick={handleLogOut}>Sign out</button>
      {JSON.stringify(session)}
    </div>
  );
}
