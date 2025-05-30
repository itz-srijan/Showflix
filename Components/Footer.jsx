"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='bg-black/50 backdrop-blur-md mt-14 text-zinc-400 px-6 py-10 border-t border-zinc-800'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Developer Info & Social Links */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='text-center md:text-left space-y-1'>
            <p className='text-white font-medium'>
              Website developed by Srijan Mondal
            </p>
            <p className='text-sm text-zinc-500'>
              For portfolio use only. This site was developed solely to showcase
              my development skills. It is not intended for any commercial
              purposes, and all rights belong to their respective owners. Any
              intellectual property rights (IPR) infringement is unintentional.
            </p>
          </div>

          <div className='flex space-x-5 text-white text-xl'>
            <a
              href='https://github.com/itz-srijan'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-gray-600 transition'
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
            TMDb.
          </p>
          <p>
            This site does not store any files on our servers — all content is
            linked from third-party platforms. For a smooth experience, we
            recommend using an ad blocker.
          </p>

          {/* Powered by TMDb */}
          <div className='flex items-center justify-center md:justify-start gap-4 pt-4'>
            <p className='text-white'>We use services from</p>
            <div className='flex flex-row gap-2'>
              <Image
                src='/images/tmdb-logo.jpg'
                alt='TMDb Logo'
                width={80}
                height={20}
                className='duration-300 transform hover:scale-105 h-10 w-20 py-[0.15rem]'
              />
              <Image
                src='/images/mongodb.jpg'
                alt='MongoDB Logo'
                width={80}
                height={30}
                className='duration-300 transform hover:scale-105 h-10 w-20'
              />
              <Image
                src='/images/vercel.jpg'
                alt='Vercel Logo'
                width={200}
                height={20}
                className='duration-300 transform hover:scale-105 h-10 w-20'
              />
            </div>
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
    </footer>
  );
}
