"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Profiles() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <main className='min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col'>
      {/* Header */}
      <header className='flex justify-between items-center px-6 py-4 border-b border-zinc-800 shadow-md'>
        <Image
          src='/images/logo.jpg'
          alt='ShowFlix Logo'
          width={128}
          height={32}
          className='w-32'
        />
        <Image
          src={session?.user?.image || "/images/default-user.png"}
          alt='User Profile'
          width={40}
          height={40}
          className='w-10 h-10 rounded-full hover:scale-105 transition-transform shadow-md'
        />
      </header>

      {/* Main Content */}
      <motion.section
        className='flex flex-col justify-center items-center text-center px-4 py-16 space-y-6 flex-grow'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className='text-4xl md:text-5xl font-extrabold tracking-tight'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Hello, {session?.user?.name}
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
          className='text-lg max-w-2xl text-zinc-400 leading-relaxed'
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
          className='px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-lg font-medium shadow-lg transition-all duration-300'
        >
          Let’s Get Started
        </motion.button>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className='bg-zinc-950 text-zinc-400 px-6 py-10 border-t border-zinc-800'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='max-w-7xl mx-auto space-y-6'>
          {/* Developer Info & Social Links */}
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='text-center md:text-left space-y-1'>
              <p className='text-white font-medium'>
                Website developed by Srijan Mondal
              </p>
              <p className='text-sm text-zinc-500'>
                For portfolio use only. Not for commercial purposes.
              </p>
            </div>

            <div className='flex space-x-5 text-white text-xl'>
              <a
                href='https://github.com/itz-srijan'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-gray-700 transition'
              >
                <FaGithub />
              </a>
              <a
                href='https://www.linkedin.com/in/srijan-mondal-474b64237/'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-blue-400 transition'
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <hr className='border-zinc-800' />

          {/* Disclaimer + TMDb Powered By */}
          <div className='text-xs leading-relaxed text-center md:text-left text-zinc-500 space-y-2'>
            <p>
              This product uses the TMDb API but is not endorsed or certified by
              TMDb. All copyrights are owned by Disney.
            </p>
            <p>
              This site does not store any files on our servers — all content is
              linked from third-party platforms. For a smooth experience, we
              recommend using an ad blocker.
            </p>

            {/* Powered by TMDb */}
            <div className='flex items-center justify-center md:justify-start gap-2 pt-2'>
              <span className='text-zinc-400'>Powered by</span>
              <Image
                src='/images/tmdb-logo.jpg'
                alt='TMDb Logo'
                width={80}
                height={20}
                className='opacity-80'
              />
            </div>

            {/* Communication / Contact Section */}
            <div className='pt-6 text-center md:text-left text-sm text-zinc-400'>
              <p className='font-medium text-white mb-1'>
                For communication or inquiries:
              </p>
              <a
                href='mailto:Srijan6mondal2001@gmail.com'
                className='hover:underline hover:text-red-500 transition'
              >
                Srijan6mondal2001@gmail.com
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
