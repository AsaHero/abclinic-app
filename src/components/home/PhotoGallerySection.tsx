// src/components/home/PhotoGallerySection.tsx
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';

// Gallery photo interface
interface GalleryPhoto {
  id: string;
  src: string;
  thumbnail: string;
  alt: string;
  category: string;
  title?: string;
  description?: string;
}

// Gallery categories for filtering
const categories = [
  { id: 'all', name: 'Все фото' },
  { id: 'equipment', name: 'Оборудование' },
  { id: 'interior', name: 'Интерьер' },
  { id: 'team', name: 'Команда' },
  { id: 'treatment', name: 'Лечение' },
];

// Sample gallery data - replace with actual clinic photos
const galleryPhotos: GalleryPhoto[] = [
  {
    id: '1',
    src: '/images/gallery/abclinic-day.jpg',
    thumbnail: `/images/gallery/abclinic-day-preview.jpg`,
    alt: 'Фасад клиники днём',
    category: 'interior',
    title: 'Вход в клинику',
    description: 'Фасад клиники в дневное время',
  },
  {
    id: '2',
    src: '/images/gallery/abclinic-night.jpg',
    thumbnail: `/images/gallery/abclinic-night-preview.jpg`,
    alt: 'Фасад клиники ночью',
    category: 'interior',
    title: 'Клиника ночью',
    description: 'Современная вывеска и освещение',
  },
  {
    id: '4',
    src: '/images/gallery/white-cab.jpg',
    thumbnail: `/images/gallery/white-cab-preview.jpg`,
    alt: 'Светлый стоматологический кабинет',
    category: 'interior',
    title: 'Кабинет',
    description: 'Чистота, стерильность и современность',
  },
  {
    id: '5',
    src: '/images/gallery/big-cab.jpg',
    thumbnail: `/images/gallery/big-cab-preview.jpg`,
    alt: 'Современное стоматологическое кресло',
    category: 'equipment',
    title: 'Стоматологическое оборудование',
    description: 'Современное оснащение кабинета',
  },
  {
    id: '6',
    src: '/images/gallery/sterilization.jpg',
    thumbnail: `/images/gallery/sterilization-preview.jpg`,
    alt: 'Стерилизационное оборудование',
    category: 'equipment',
    title: 'Стерилизация',
    description: 'Надежная стерилизация инструментов',
  },
  {
    id: '7',
    src: '/images/gallery/nakladki-group.jpg',
    thumbnail: `/images/gallery/nakladki-group-preview.jpg`,
    alt: 'Диагностические модели челюстей',
    category: 'equipment',
    title: 'Диагностические модели',
    description: 'Модели зубов для точной диагностики и планирования',
  },
  {
    id: '8',
    src: '/images/gallery/nakladki-estetics.png',
    thumbnail: `/images/gallery/nakladki-estetics-preview.jpg`,
    alt: 'Зубные накладки на фоне растений',
    category: 'treatment',
    title: 'Эстетика лечения',
    description: 'Качественные материалы и внимание к деталям',
  },
  {
    id: '9',
    src: '/images/gallery/ibrohimjon-azimov-cerificate.jpg',
    thumbnail: `/images/gallery/ibrohimjon-azimov-cerificate-preview.jpg`,
    alt: 'Сертификат доктора',
    category: 'team',
    title: 'Профессионализм',
    description: 'Сертифицированный специалист',
  },
  {
    id: '10',
    src: '/images/gallery/oda.jpg',
    thumbnail: `/images/gallery/oda-preview.jpg`,
    alt: 'Участники международного имплантологического проекта',
    category: 'team',
    title: 'Проект ODA',
    description:
      'Совместный проект с австралийскими хирургами по установке бесплатных имплантатов населению',
  },
];

// Premium photo card component with preview optimization
const PhotoCard = ({ photo, index, onClick, className = '' }) => {
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const getCardHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-88', 'h-76', 'h-84'];
    return heights[index % heights.length];
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer overflow-hidden rounded-xl bg-gray-900 ${getCardHeight(index)} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * (index % 8) }}
      onClick={() => onClick(photo)}
      whileHover={{ y: -5 }}
    >
      {/* Premium loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
        </div>
      )}

      {/* Photo with premium loading effect - using preview for performance */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={photo.thumbnail}
          alt={photo.alt}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Fallback to main image if preview fails, then to placeholder
            if (e.currentTarget.src === photo.thumbnail) {
              e.currentTarget.src = photo.src;
            } else {
              e.currentTarget.src = '/images/placeholder-clinic.jpg';
            }
            setImageLoaded(true);
          }}
        />

        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Premium hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="text-white">
            {photo.title && <h3 className="font-medium mb-1">{photo.title}</h3>}
            {photo.description && <p className="text-sm text-white/80">{photo.description}</p>}
          </div>
        </div>

        {/* Premium zoom icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <ZoomIn size={18} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

// Premium lightbox modal component - fixed image repetition
const Lightbox = ({ photo, isOpen, onClose, onNext, onPrev }) => {
  if (!isOpen || !photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <ArrowRight size={24} className="text-white" />
        </button>

        {/* Photo container - optimized for full image visibility */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center px-16 py-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 'calc(100vw - 120px)',
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Image with optimal sizing */}
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-clinic.jpg';
              }}
            />

            {/* Photo info overlay - positioned outside image */}
          </div>

          {/* Photo info positioned below image */}
          {(photo.title || photo.description) && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 max-w-lg text-center">
              {photo.title && (
                <h3 className="text-white text-lg font-medium mb-1">{photo.title}</h3>
              )}
              {photo.description && <p className="text-white/80 text-sm">{photo.description}</p>}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PhotoGallerySection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter photos based on selected category
  const filteredPhotos =
    selectedCategory === 'all'
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === selectedCategory);

  // Lightbox navigation
  const openLightbox = (photo: GalleryPhoto) => {
    setLightboxPhoto(photo);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxPhoto(null);
  };

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (!lightboxPhoto) return;

    const currentIndex = filteredPhotos.findIndex((photo) => photo.id === lightboxPhoto.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    }

    setLightboxPhoto(filteredPhotos[newIndex]);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="py-24 md:py-32 bg-primary-900 text-white w-full relative overflow-hidden"
      >
        {/* Premium background elements */}
        <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

        {/* Premium floating gradient */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          {/* Premium section heading */}
          <div className="mb-16 md:mb-20">
            <motion.div
              className="relative mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white"
                initial={{ y: 40 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Галерея клиники
              </motion.h2>

              {/* Premium animated underline */}
              <motion.div
                className="h-px w-0 bg-gradient-to-r from-white/5 via-white/80 to-white/5 mt-4"
                initial={{ width: 0 }}
                animate={isInView ? { width: '140px' } : { width: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            <motion.p
              className="text-lg text-gray-400 max-w-2xl mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Познакомьтесь с нашей современной клиникой, оборудованием и командой профессионалов
              через фотографии.
            </motion.p>
          </div>

          {/* Premium category filter */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm border ${
                  selectedCategory === category.id
                    ? 'bg-white text-primary-900 border-white'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Premium masonry photo grid with dynamic visual hierarchy */}
          <motion.div
            className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={`${selectedCategory}-${photo.id}`}
                  className="break-inside-avoid mb-4 md:mb-6"
                >
                  <PhotoCard
                    photo={photo}
                    index={index}
                    onClick={openLightbox}
                    className="w-full"
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Premium photos count indicator */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <div className="text-gray-400 text-sm">
              Показано {filteredPhotos.length} из {galleryPhotos.length} фотографий
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Lightbox */}
      <Lightbox
        photo={lightboxPhoto}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNext={() => navigateLightbox('next')}
        onPrev={() => navigateLightbox('prev')}
      />
    </>
  );
};

export default PhotoGallerySection;
