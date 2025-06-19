// src/components/sections/VideoSection.tsx
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Premium video controls
  const handlePlayToggle = () => {
    console.log(videoRef.current);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-pause video when out of view for premium performance
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (isPlaying && videoRef.current) {
            videoRef.current.play();
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-[#171b21] text-white w-full relative overflow-hidden"
    >
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

      {/* Premium subtle gradient accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Premium section heading with enhanced animation */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Видео о клинике
          </motion.h2>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Посмотрите видеотур по нашей клинике и познакомьтесь с нашим современным оборудованием и
            командой профессионалов.
          </motion.p>

          {/* Premium animated underline */}
          <motion.div
            className="h-px w-0 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8"
            initial={{ width: 0 }}
            animate={isInView ? { width: '140px' } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Premium video container with enhanced styling */}
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
            {!isPlaying && !videoRef.current ? (
              <>
                {/* Premium thumbnail with subtle animation */}
                <motion.div
                  className="absolute inset-0 z-0"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  <img
                    src="/images/tour.jpg"
                    alt="Dental clinic video thumbnail"
                    className="w-full h-full object-cover rounded-2xl brightness-[0.85]"
                  />
                </motion.div>

                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-primary-900/30 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent rounded-2xl"></div>

                {/* Premium play button with enhanced animations */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <motion.button
                    onClick={handlePlayToggle}
                    className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full
                      flex items-center justify-center transition-transform hover:scale-110
                      focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20
                      group relative overflow-hidden"
                    aria-label="Смотреть видео"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                    <Play
                      size={36}
                      className="text-white ml-1 group-hover:text-white/90 relative z-10"
                      fill="white"
                    />
                  </motion.button>

                  {/* Premium animated text */}
                  <motion.span
                    className="mt-8 text-xl font-medium text-white tracking-wide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Смотреть видео
                  </motion.span>
                </div>
              </>
            ) : (
              <AnimatePresence>
                <motion.div
                  key="video"
                  className="w-full h-full rounded-2xl overflow-hidden relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Premium video element with enhanced controls */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-2xl"
                    autoPlay
                    muted={isMuted}
                    playsInline
                    loop
                  >
                    <source src="/videos/tour.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>

                  {/* Premium video controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      onClick={handlePlayToggle}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                        hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </motion.button>

                    <motion.button
                      onClick={handleMuteToggle}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                        hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Premium video features list - new addition */}
          <motion.div
            className="mt-8 flex flex-col md:flex-row justify-center gap-6 md:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 9C9.5 8.17157 10.1716 7.5 11 7.5H13C13.8284 7.5 14.5 8.17157 14.5 9C14.5 9.82843 13.8284 10.5 13 10.5H11C10.1716 10.5 9.5 11.1716 9.5 12C9.5 12.8284 10.1716 13.5 11 13.5H13C13.8284 13.5 14.5 14.1716 14.5 15C14.5 15.8284 13.8284 16.5 13 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7.5V6.5"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 17.5V16.5"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white/90">Современное оборудование</h4>
                <p className="text-sm text-gray-400">Новейшие технологии</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white/90">Команда профессионалов</h4>
                <p className="text-sm text-gray-400">Лучшие специалисты</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white/90">Комфортная обстановка</h4>
                <p className="text-sm text-gray-400">Для спокойного лечения</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
