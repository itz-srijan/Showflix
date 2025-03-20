"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      // Redirect to the root page after login
      await signIn("google", { callbackUrl: "/profiles" });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div
      onClick={handleGoogleSignIn}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
    >
      <FcGoogle size={30} />
    </div>
  );
};

export default GoogleSignInButton;

