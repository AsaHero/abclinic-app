// components/services/ImageGallery.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onModalChange?: (isOpen: boolean) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onModalChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  // Handle modal state changes
  useEffect(() => {
    if (onModalChange) {
      onModalChange(isModalOpen);
    }
  }, [isModalOpen, onModalChange]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-3 text-white">Галерея</h3>
          
          <div className="relative">
            {/* Image Container - Reduced aspect ratio */}
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-800 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`Изображение ${currentIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={openModal}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Expand button */}
              <button
                onClick={openModal}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <Expand size={12} />
              </button>

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

            {/* Image counter and info */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {currentIndex + 1} из {images.length}
              </span>
              
              {/* Dots navigation */}
              {images.length > 1 && images.length <= 5 && (
                <div className="flex space-x-1">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
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
      </div>

      {/* Modal for full-size image view */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`Изображение ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors text-xl font-light"
              >
                ×
              </button>

              {/* Modal navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Modal counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;