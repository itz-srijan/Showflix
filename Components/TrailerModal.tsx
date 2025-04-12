"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player/youtube";

interface TrailerModalProps {
  youtubeKey: string;
  onClose: () => void;
}

const TrailerModal = ({ youtubeKey, onClose }: TrailerModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the video
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  if (!youtubeKey) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm text-white text-lg'>
        No trailer found
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className='relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/90'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${youtubeKey}`}
            playing
            controls
            width='100%'
            height='100%'
            className='react-player'
          />
          <button
            onClick={onClose}
            className='absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-lg transition'
            aria-label='Close'
          >
            <X size={24} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrailerModal;
