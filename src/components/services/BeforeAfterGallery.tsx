// components/services/BeforeAfterGallery.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterImage {
  before: string;
  after: string;
  description?: string;
}

interface BeforeAfterGalleryProps {
  images: BeforeAfterImage[];
}

const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setShowAfter(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setShowAfter(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
      <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-3 text-white">До и После</h3>
        
        <div className="relative">
          {/* Image Container - Reduced aspect ratio */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-800">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${currentIndex}-${showAfter}`}
                src={showAfter ? currentImage.after : currentImage.before}
                alt={showAfter ? 'После лечения' : 'До лечения'}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {/* Before/After Toggle */}
            <div className="absolute bottom-2 left-2 flex bg-black/60 backdrop-blur-sm rounded-md p-0.5">
              <button
                onClick={() => setShowAfter(false)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  !showAfter 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                До
              </button>
              <button
                onClick={() => setShowAfter(true)}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  showAfter 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                После
              </button>
            </div>

            {/* Navigation arrows - only show if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </>
            )}
          </div>

          {/* Description */}
          {currentImage.description && (
            <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">
              {currentImage.description}
            </p>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="flex justify-center mt-2 space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowAfter(false);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterGallery;