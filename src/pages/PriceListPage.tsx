import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getServices, getCategories } from '../api/services';
import { requiresConsultation } from '../types/serviceData';
import type { ServiceCategory } from '../types/serviceData';
import {
  Calendar,
  Phone,
  Info,
  AlertCircle,
  Check,
} from 'lucide-react';
import CategoryInformation from '../components/services/CategoryInformation';
import HowItWorksModal from '../components/services/HowItWorksModal';
import CenteredCarousel from '../components/services/CenteredCarousel';
import SeoLite from '@/components/seo/SeoLite';

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

const SITE = 'https://abclinic.uz';
const OG_IMAGE = `${SITE}/images/hero.png`;

// "All" pseudo-category always shown first
const ALL_CATEGORY: ServiceCategory = { id: 'all', title: 'Все услуги' };

const PriceListPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewClient, setIsNewClient] = useState<boolean>(true);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState<boolean>(false);

  const controls = useAnimation();

  // Fetch categories from API
  const { data: apiCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Prepend "all" pseudo-category
  const serviceCategories: ServiceCategory[] = [ALL_CATEGORY, ...apiCategories];

  // Fetch all services (server filters by category when not 'all')
  const { data: allServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    window.scrollTo(0, 0);
  }, [controls]);

  // Extract category from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get('category');
    if (categoryParam && apiCategories.some((cat) => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [apiCategories]);

  // Filter services by active category client-side
  const displayedServices = React.useMemo(() => {
    if (activeCategory === 'all') return allServices;
    return allServices.filter(
      (s) => s.category === activeCategory || s.categories?.includes(activeCategory)
    );
  }, [allServices, activeCategory]);

  // Filter by search
  const filteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return displayedServices;
    const query = searchQuery.toLowerCase();
    return displayedServices.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.price.toString().includes(query)
    );
  }, [displayedServices, searchQuery]);

  // Popular services in current category
  const popularServices = React.useMemo(() => {
    return displayedServices.filter((s) => s.popular);
  }, [displayedServices]);

  const activeCategoryTitle = React.useMemo(
    () => serviceCategories.find((c) => c.id === activeCategory)?.title ?? 'Все услуги',
    [serviceCategories, activeCategory]
  );

  const showPopularServices = !searchQuery.trim();

  const handleToggleClientType = (isNew: boolean) => setIsNewClient(isNew);

  const handleCategoryChange = (categoryId: string) => {
    if (activeCategory === categoryId) return;
    setIsContentLoading(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsContentLoading(false);
      const url = new URL(window.location.href);
      if (categoryId === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', categoryId);
      }
      window.history.pushState({}, '', url.toString());
    }, 300);
  };

  // Meta
  const meta = React.useMemo(() => {
    const catTitle =
      activeCategory === 'all'
        ? 'Все услуги'
        : (serviceCategories.find((c) => c.id === activeCategory)?.title ?? 'Услуги');
    const isSearch = !!searchQuery.trim();
    const title = isSearch
      ? `Поиск: "${searchQuery.trim()}" — Цены — abclinic.uz`
      : `${catTitle} — цены — abclinic.uz`;
    const description = isSearch
      ? `Результаты поиска по запросу "${searchQuery.trim()}" в прайс-листе abclinic.uz.`
      : `Актуальные цены: ${catTitle.toLowerCase()} в abclinic.uz. Гигиена GBT, реставрации, эстетика, имплантация, пакеты.`;
    const url = isSearch
      ? `${SITE}/services`
      : activeCategory === 'all'
        ? `${SITE}/services`
        : `${SITE}/services?category=${encodeURIComponent(activeCategory)}`;
    return { title, description, url, image: OG_IMAGE, noindex: isSearch };
  }, [activeCategory, searchQuery, serviceCategories]);

  const itemListJson = React.useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredServices.slice(0, 12).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/services/${s.id}`,
      name: s.name,
    })),
  }), [filteredServices]);

  return (
    <>
      <SeoLite
        title={meta.title}
        description={meta.description}
        url={meta.url}
        image={meta.image}
        noindex={meta.noindex}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }}
      />

      <div className="min-h-screen bg-[#171b21] text-white">
        <AnimatePresence>
          <HowItWorksModal
            isOpen={isHowItWorksModalOpen}
            onClose={() => setIsHowItWorksModalOpen(false)}
          />
        </AnimatePresence>

        {/* Hero */}
        <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#1A1E24] to-[#171b21]">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <motion.div
              className="flex justify-between items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category tabs */}
        <section className="py-12 border-t border-gray-800">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            {/* Desktop */}
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

            {/* Mobile */}
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

        {/* Main content */}
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {!searchQuery && (
            <CategoryInformation
              requiresConsultation={
                serviceCategories.find((s) => s.id === activeCategory)?.requiresConsultation
              }
              onToggleClientType={handleToggleClientType}
              setIsHowItWorksModalOpen={setIsHowItWorksModalOpen}
            />
          )}

          {/* Popular services */}
          {popularServices.length > 0 && showPopularServices && (
            <section className="py-4 mb-16">
              <motion.h2
                className="text-3xl font-arista-light mb-6 px-4 md:px-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isContentLoading ? 0 : 1, y: isContentLoading ? 10 : 0 }}
                transition={{ duration: 0.5 }}
              >
                Популярные услуги
              </motion.h2>
              <div className="-mx-4 md:-mx-8 lg:-mx-12">
                <CenteredCarousel popularServices={popularServices} isNewClient={isNewClient} />
              </div>
            </section>
          )}

          {/* Services list */}
          <section id="services-list" className="pb-12">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isContentLoading ? 0 : 1, y: isContentLoading ? 10 : 0 }}
              transition={{ duration: 0.5 }}
              key={activeCategory}
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

            {servicesLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
              </div>
            ) : (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate={isContentLoading ? 'hidden' : 'visible'}
                key={`${activeCategory}-${searchQuery}`}
              >
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => {
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
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            )}
          </section>

          {/* CTA */}
          <section className="py-20 bg-[#1a1e24]">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
              <motion.div
                className="bg-gradient-to-br from-[#1E2329]/80 to-[#252A32]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
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
      </div>
    </>
  );
};

export default PriceListPage;
