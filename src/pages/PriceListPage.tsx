import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  serviceCategories,
  allServices,
  getServicesByCategory,
  getPopularServices,
  requiresConsultation,
} from '../types/serviceData';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Info,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import CategoryInformation from '../components/services/CategoryInformation';
import HowItWorksModal from '../components/services/HowItWorksModal';
import CenteredCarousel from '../components/services/CenteredCarousel';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Removed ScrollCards component definition as it's replaced by CenteredCarousel

const PriceListPage: React.FC = () => {
  // State for active category
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Loading state for page transitions
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State for client type (new or existing)
  const [isNewClient, setIsNewClient] = useState<boolean>(true);

  // State for "How it works" modal
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState<boolean>(false);

  const controls = useAnimation();

  // Setup page entry animation
  useEffect(() => {
    // Start animation sequence
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    });

    // Smooth scroll restoration
    window.scrollTo(0, 0);
  }, [controls]);

  // Get filtered services based on active category
  const displayedServices = React.useMemo(() => {
    return getServicesByCategory(activeCategory);
  }, [activeCategory]);

  // Filtered services based on search
  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return displayedServices;
    }

    const query = searchQuery.toLowerCase();
    return displayedServices.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        (typeof service.price === 'number' && service.price.toString().includes(query))
    );
  }, [displayedServices, searchQuery]);

  // Get popular services
  const popularServices = React.useMemo(() => {
    return getPopularServices(activeCategory);
  }, [activeCategory]);

  // Active category title
  const activeCategoryTitle = React.useMemo(() => {
    return serviceCategories.find((cat) => cat.id === activeCategory)?.title || 'Все услуги';
  }, [activeCategory]);

  // Flag to determine if we should show popular services
  const showPopularServices = !searchQuery.trim();

  // Handle client type toggle
  const handleToggleClientType = (isNew: boolean) => {
    setIsNewClient(isNew);
  };

  // Extract category from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get('category');

    if (categoryParam && serviceCategories.some((cat) => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fade in the page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle category switch
  const handleCategoryChange = (categoryId: string) => {
    if (activeCategory === categoryId) return; // Don't do anything if clicking the same category

    // Create smooth transition between categories
    setIsLoading(true);

    // Short delay to allow fade out animation
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsLoading(false);

      // Update URL
      const url = new URL(window.location.href);
      if (categoryId === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', categoryId);
      }
      window.history.pushState({}, '', url.toString());

      // Do not auto-scroll to services list when changing categories
    }, 300);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#171b21] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* "How it works" modal */}
      <AnimatePresence>
        <HowItWorksModal
          isOpen={isHowItWorksModalOpen}
          onClose={() => setIsHowItWorksModalOpen(false)}
        />
      </AnimatePresence>

      {/* Section 1: Hero section with "Цены" */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#1A1E24] to-[#171b21]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            className="flex justify-between items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main heading with modern typography */}
            <motion.h1
              className="text-5xl md:text-7xl font-arista-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Цены
            </motion.h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск услуг..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 rounded-full bg-[#252A32] border border-gray-700 text-white text-sm w-48 md:w-56 lg:w-64 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Очистить поиск"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Category tabs */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {/* Desktop tabs */}
          <div className="hidden md:block">
            <div className="flex justify-center">
              <div className="inline-flex space-x-2 p-1 bg-[#1E2329]/50 rounded-full">
                {serviceCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-white text-[#171b21] shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.title}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile scrollable tabs */}
          <div className="md:hidden">
            <div className="overflow-x-auto hide-scrollbar py-2">
              <div className="inline-flex space-x-2 min-w-max px-4">
                {serviceCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-white text-[#171b21] shadow-md'
                        : 'border border-gray-700 text-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.title}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* NEW: Category Information Component */}
        {!searchQuery && (
          <CategoryInformation
            requiresConsultation={
              serviceCategories.find((s) => s.id === activeCategory)?.requiresConsultation
            }
            onToggleClientType={handleToggleClientType}
            setIsHowItWorksModalOpen={setIsHowItWorksModalOpen}
          />
        )}

        {/* Section 3: Popular services cards - only shown when NOT searching */}
        {popularServices.length > 0 && showPopularServices && (
          <section className="py-4 mb-16">
            <div>
              <motion.h2
                className="text-3xl font-arista-light mb-6 px-4 md:px-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
                transition={{ duration: 0.5 }}
              >
                Популярные услуги
              </motion.h2>
              <div className="-mx-4 md:-mx-8 lg:-mx-12">
                <CenteredCarousel popularServices={popularServices} isNewClient={isNewClient} />
              </div>
            </div>
          </section>
        )}

        {/* Section 4: List of services in selected category */}
        <section id="services-list" className="pb-12">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
            transition={{ duration: 0.5 }}
            key={activeCategory} // Re-animate when category changes
          >
            <div>
              {searchQuery ? (
                <h2 className="text-3xl font-arista-light mb-2">
                  Результаты поиска: "{searchQuery}"
                </h2>
              ) : (
                <h2 className="text-3xl font-arista-light mb-2">{activeCategoryTitle}</h2>
              )}
              <p className="text-gray-400">
                {filteredServices.length}{' '}
                {filteredServices.length === 1
                  ? 'услуга'
                  : filteredServices.length >= 2 && filteredServices.length <= 4
                    ? 'услуги'
                    : 'услуг'}
              </p>
            </div>

            {/* Add "How it works" button for non-search view */}
            {!searchQuery && (
              <button
                onClick={() => setIsHowItWorksModalOpen(true)}
                className="mt-4 md:mt-0 px-5 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white flex items-center transition-all"
              >
                <Info size={16} className="mr-2" />
                Как проходит лечение
              </button>
            )}
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={isLoading ? 'hidden' : 'visible'}
            key={`${activeCategory}-${searchQuery}`} // Re-animate when key params change
          >
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                // Check if service requires consultation
                const needsConsultation = requiresConsultation(service);

                return (
                  <motion.div
                    key={service.id}
                    className="bg-[#1E2329] rounded-lg overflow-hidden hover:bg-[#252A32] transition-colors duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link to={`/services/${service.id}`} className="block">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-medium text-white">{service.name}</h3>

                              {/* Show special badges */}
                              {service.popular && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                  Популярно
                                </span>
                              )}

                              {service.isSpecialOffer && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                  Спецпредложение
                                </span>
                              )}

                              {service.includesConsultation && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded flex items-center">
                                  <Check size={10} className="mr-1" />
                                  Включает консультацию
                                </span>
                              )}

                              {needsConsultation && !service.includesConsultation && (
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded flex items-center">
                                  <AlertCircle size={10} className="mr-1" />
                                  Требуется консультация
                                </span>
                              )}
                            </div>

                            <p className="text-gray-400 mt-1 text-sm md:pr-10 line-clamp-1">
                              {service.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                            <div className="md:mr-12 flex items-center">
                              <span className="text-sm text-gray-400 mr-2">{service.duration}</span>
                            </div>

                            <div className="flex items-center">
                              <span className="font-medium text-white text-lg mr-4">
                                {typeof service.price === 'number'
                                  ? `${service.price.toLocaleString('ru-RU')} сум`
                                  : 'Цена по запросу'}
                              </span>
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-10">
                {searchQuery ? (
                  <div>
                    <p className="text-gray-400 mb-4">
                      По запросу "{searchQuery}" ничего не найдено
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Сбросить поиск
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400">Нет услуг в данной категории</p>
                )}
              </div>
            )}
          </motion.div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-[#1a1e24]">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              className="bg-gradient-to-br from-[#1E2329]/80 to-[#252A32]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-blue-500/10 filter blur-3xl"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 filter blur-3xl"></div>

              <div className="relative z-10 md:flex justify-between items-center">
                <div className="md:max-w-lg mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-arista-light mb-4">
                    Нужна консультация?
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Запишитесь на прием к нашим специалистам прямо сейчас. Мы поможем подобрать
                    оптимальное лечение и ответим на все ваши вопросы.
                  </p>
                </div>

                <div className="flex flex-col space-y-4">
                  <Link
                    to="/contact"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Calendar size={18} className="mr-2" />
                    Записаться на консультацию
                  </Link>

                  <Link
                    to="/contact"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                  >
                    <Phone size={18} className="mr-2" />
                    Позвонить нам
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default PriceListPage;
