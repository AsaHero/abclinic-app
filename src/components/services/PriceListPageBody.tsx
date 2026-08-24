"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { requiresConsultation } from "@/types/serviceData";
import type { PriceItem, ServiceCategory, ServiceGroup } from "@/types/serviceData";
import { Info, AlertCircle, Check, Layers } from "lucide-react";
import CategoryInformation from "@/components/services/CategoryInformation";
import HowItWorksModal from "@/components/services/HowItWorksModal";
import ServiceGroupModal from "@/components/services/ServiceGroupModal";
import ProblemGroupGrid from "@/components/services/ProblemGroupGrid";
import CenteredCarousel from "@/components/services/CenteredCarousel";
import ConsultationCTA from "@/components/common/ConsultationCTA";

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

// "All" pseudo-category always shown first
const ALL_CATEGORY: ServiceCategory = { id: "all", title: "Все услуги" };

// Russian plural forms for "вариант" — group sizes here never exceed single
// digits, so the 11-14 exception doesn't need handling.
function pluralizeVariants(count: number): string {
  if (count === 1) return "вариант";
  if (count >= 2 && count <= 4) return "варианта";
  return "вариантов";
}

interface PriceListPageBodyProps {
  categories: ServiceCategory[];
  services: PriceItem[];
  groups: ServiceGroup[];
  initialCategory: string;
}

// A row in the rendered price list is either a standalone service or one
// group card standing in for all of its member services.
type ListEntry = { type: "service"; data: PriceItem } | { type: "group"; data: ServiceGroup };

const PriceListPageBody: React.FC<PriceListPageBodyProps> = ({ categories, services, groups, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNewClient, setIsNewClient] = useState<boolean>(true);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<ServiceGroup | null>(null);

  // Prepend "all" pseudo-category
  const serviceCategories: ServiceCategory[] = useMemo(() => [ALL_CATEGORY, ...categories], [categories]);

  // Keep in sync if the server-resolved category (from the URL) changes underneath us
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter services by active category client-side
  const displayedServices = React.useMemo(() => {
    if (activeCategory === "all") return services;
    return services.filter((s) => s.category === activeCategory || s.categories?.includes(activeCategory));
  }, [services, activeCategory]);

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

  // Services that belong to a group render only as that group's card — not
  // as a separate row anywhere, including the popular-services carousel.
  const groupByServiceId = React.useMemo(() => {
    const map = new Map<string, ServiceGroup>();
    for (const group of groups) {
      for (const service of group.services) map.set(service.id, group);
    }
    return map;
  }, [groups]);

  // Popular services in current category
  const popularServices = React.useMemo(() => {
    return displayedServices.filter((s) => s.popular && !groupByServiceId.has(s.id));
  }, [displayedServices, groupByServiceId]);

  // Collapse every service that belongs to a group into a single group card
  // at the position of its first member, instead of listing each tier as its
  // own row (e.g. накладки by material — hybrid/e.max/feldspathic).
  const listEntries: ListEntry[] = React.useMemo(() => {
    const seenGroups = new Set<string>();
    const entries: ListEntry[] = [];
    for (const service of filteredServices) {
      const group = groupByServiceId.get(service.id);
      if (group) {
        if (seenGroups.has(group.id)) continue;
        seenGroups.add(group.id);
        entries.push({ type: "group", data: group });
      } else {
        entries.push({ type: "service", data: service });
      }
    }
    return entries;
  }, [filteredServices, groupByServiceId]);

  const activeCategoryTitle = React.useMemo(
    () => serviceCategories.find((c) => c.id === activeCategory)?.title ?? "Все услуги",
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
      if (categoryId === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", categoryId);
      }
      window.history.pushState({}, "", url.toString());
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#001d1c] text-white">
      <AnimatePresence>
        <HowItWorksModal isOpen={isHowItWorksModalOpen} onClose={() => setIsHowItWorksModalOpen(false)} />
      </AnimatePresence>
      <ServiceGroupModal group={openGroup} onClose={() => setOpenGroup(null)} />

      {/* Hero */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#002a27] to-[#001d1c]">
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
                aria-label="Поиск услуг"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 rounded-full bg-[#003932] border border-gray-700 text-white text-sm w-48 md:w-56 lg:w-64 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
                  onClick={() => setSearchQuery("")}
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

      {/* Problem-based entry grid — primary navigation: "с какой задачей
          вы к нам", not clinical department. Hidden while searching, since
          it duplicates the same intent the search box already serves. */}
      {!searchQuery && (
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <ProblemGroupGrid groups={groups} onOpenGroup={setOpenGroup} />
          </div>
        </section>
      )}

      {/* Category tabs — secondary, complete browse layer (also covers
          consultation, packages, exclusive programs, накладки edge cases —
          everything not folded into the problem grid above). */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {!searchQuery && (
            <p className="text-center text-gray-500 text-sm mb-6">Или посмотрите полный прайс-лист</p>
          )}
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="flex justify-center">
              <div className="inline-flex space-x-2 p-1 bg-[#002a27]/50 rounded-full">
                {serviceCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? "bg-white text-[#001d1c] shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
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
                        ? "bg-white text-[#001d1c] shadow-md"
                        : "border border-gray-700 text-gray-300"
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
            requiresConsultation={serviceCategories.find((s) => s.id === activeCategory)?.requiresConsultation}
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
              <CenteredCarousel popularServices={popularServices} isNewClient={isNewClient} categories={categories} />
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
                <h2 className="text-3xl font-arista-light mb-2">Результаты поиска: &quot;{searchQuery}&quot;</h2>
              ) : (
                <h2 className="text-3xl font-arista-light mb-2">{activeCategoryTitle}</h2>
              )}
              <p className="text-gray-400">
                {filteredServices.length}{" "}
                {filteredServices.length === 1
                  ? "услуга"
                  : filteredServices.length >= 2 && filteredServices.length <= 4
                    ? "услуги"
                    : "услуг"}
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

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={isContentLoading ? "hidden" : "visible"}
            key={`${activeCategory}-${searchQuery}`}
          >
            {listEntries.length > 0 ? (
              listEntries.map((entry) => {
                if (entry.type === "group") {
                  const group = entry.data;
                  const minPrice = Math.min(...group.services.map((s) => s.price));
                  return (
                    <motion.div
                      key={group.id}
                      className="bg-[#002a27] rounded-lg overflow-hidden hover:bg-[#003932] transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <button type="button" onClick={() => setOpenGroup(group)} className="w-full text-left block">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-medium text-white">{group.title}</h3>
                              <span className="text-xs bg-forest-500/20 text-forest-400 px-2 py-0.5 rounded flex items-center">
                                <Layers size={10} className="mr-1" />
                                {group.services.length} {pluralizeVariants(group.services.length)}
                              </span>
                            </div>
                            <p className="text-gray-400 mt-1 text-sm md:pr-10 line-clamp-1">{group.tagline}</p>
                          </div>

                          <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                            <div className="flex items-center">
                              <span className="font-medium text-white text-lg mr-4">
                                от {minPrice.toLocaleString("ru-RU")} сум
                              </span>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      </button>
                    </motion.div>
                  );
                }

                const service = entry.data;
                const needsConsultation = requiresConsultation(service);
                return (
                  <motion.div
                    key={service.id}
                    className="bg-[#002a27] rounded-lg overflow-hidden hover:bg-[#003932] transition-colors duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link href={`/services/${service.id}`} className="block">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-medium text-white">{service.name}</h3>
                              {service.popular && (
                                <span className="text-xs bg-forest-500/20 text-forest-400 px-2 py-0.5 rounded">
                                  Популярно
                                </span>
                              )}
                              {service.isSpecialOffer && (
                                <span className="text-xs bg-forest-500/20 text-forest-400 px-2 py-0.5 rounded">
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
                            <p className="text-gray-400 mt-1 text-sm md:pr-10 line-clamp-1">{service.description}</p>
                          </div>

                          <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                            <div className="md:mr-12 flex items-center">
                              <span className="text-sm text-gray-400 mr-2">{service.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-white text-lg mr-4">
                                {typeof service.price === "number"
                                  ? `${service.price.toLocaleString("ru-RU")} сум`
                                  : "Цена по запросу"}
                              </span>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-gray-400 mb-4">По запросу &quot;{searchQuery}&quot; ничего не найдено</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-forest-400 hover:text-forest-300 transition-colors"
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

        <ConsultationCTA
          title="Нужна консультация?"
          description="Запишитесь на прием к нашим специалистам прямо сейчас. Мы поможем подобрать оптимальное лечение и ответим на все ваши вопросы."
        />
      </div>
    </div>
  );
};

export default PriceListPageBody;
