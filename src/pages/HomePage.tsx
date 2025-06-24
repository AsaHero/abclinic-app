// src/pages/HomePage.tsx
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import TimelineSection from '@/components/home/TimelineSection';
import VideoSection from '@/components/home/VideoSection';
import ServicesSection from '@/components/home/ServicesSection';
import PhotoGallerySection from '@/components/home/PhotoGallerySection';
import InfoDocumentsSection from '@/components/home/InfoDocumentsSection';
import ContactMapSection from '@/components/home/ContactMapSection';
import { timelineData } from '../types/timelineData';

const HomePage = () => {
  const controls = useAnimation();

  // Setup page entry animation
  useEffect(() => {
    // Start animation sequence
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0, 1] },
    });

    // Smooth scroll restoration
    window.scrollTo(0, 0);
  }, [controls]);

  return (
    <motion.div className="w-full" initial={{ opacity: 0, y: 10 }} animate={controls}>
      {/* Hero Section */}
      <HeroSection />

      {/* History/Timeline Section */}
      <div id="timeline-section">
        <TimelineSection />
      </div>

      {/* Video Section */}
      <VideoSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Photo Gallery Section */}
      <PhotoGallerySection />

      {/* Information Documents Section */}
      <InfoDocumentsSection />

      {/* Contact Map Section */}
      <ContactMapSection />

    </motion.div>
  );
};

export default HomePage;
