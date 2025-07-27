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
  // Setup page entry - simplified to avoid white flashes
  useEffect(() => {
    // Smooth scroll restoration
    window.scrollTo(0, 0);
  }, []);

  return (
    // REMOVED problematic opacity animation that can cause white flashes
    <div className="w-full">
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
    </div>
  );
};

export default HomePage;
