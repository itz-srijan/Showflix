"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInButtonProps {
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ className }) => {
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
      className={`w-10 h-10 bg-white flex items-center justify-center cursor-pointer hover:opacity-80 transition ${className}`}
    >
      <FcGoogle size={30} />
    </div>
  );
};

export default GoogleSignInButton;

