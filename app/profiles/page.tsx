"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Footer from "@/Components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Profiles() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <main className="relative min-h-screen w-full bg-[url('/images/profile_bg.jpg')] bg-no-repeat bg-center bg-cover text-white flex flex-col">
      {/* Header */}
      <header className='flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md shadow-md z-10'>
        <Image
          src='/images/logo.jpg'
          alt='ShowFlix Logo'
          width={128}
          height={32}
          className='w-32 object-contain'
        />
        <Image
          src={session?.user?.image || "/images/default-user.png"}
          alt='User Profile'
          width={40}
          height={40}
          className='w-10 h-10 rounded-full hover:scale-105 transition-transform border-2 border-gray-600 shadow-md'
        />
      </header>

      {/* Main Content */}
      <motion.section
        className='relative flex flex-col justify-center items-center text-center px-6 py-20 space-y-6 flex-grow'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className='absolute inset-0 bg-black/60 z-0' />
        <div className='relative z-10'>
          <motion.h1
            className='text-4xl md:text-5xl font-extrabold tracking-tight'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hello, {session?.user?.name?.split(" ")[0] || "User"}!
          </motion.h1>
          <motion.h2
            className='text-3xl md:text-4xl font-semibold text-zinc-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to <span className='text-red-600'>ShowFlix</span>
          </motion.h2>
          <motion.p
            className='text-lg max-w-2xl text-zinc-300 leading-relaxed'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Dive into a world of endless entertainment — movies, series, and
            documentaries tailored to your taste. All in one place.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className='mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-lg font-medium shadow-lg transition-all duration-300'
          >
            Let’s Get Started
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.div>
        <Footer />
      </motion.div>
    </main>
  );
}
