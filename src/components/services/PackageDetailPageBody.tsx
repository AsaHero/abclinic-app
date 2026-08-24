"use client";

// src/components/services/PackageDetailPageBody.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, Calendar, Phone, ChevronRight } from "lucide-react";
import type { TreatmentPackage } from "@/types/packageData";
import type { TeamMember } from "@/types/team";
import ContactWithUs from "@/components/common/ContactWithUs";

interface PackageDetailPageBodyProps {
  packageItem: TreatmentPackage;
  relatedPackages: TreatmentPackage[];
  specialists: TeamMember[];
}

const PackageDetailPageBody: React.FC<PackageDetailPageBodyProps> = ({ packageItem, relatedPackages, specialists }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [packageItem.id]);

  return (
    <div className="min-h-screen pt-47 bg-[#001d1c] text-white">
      {/* Back button and breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/complex-treatment" className="hover:text-white transition-colors">
            Комплексное лечение
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{packageItem.name}</span>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <motion.section
        className="py-12 bg-gradient-to-r from-[#00463C]/0 to-[#006A59]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <Link
            href="/complex-treatment"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-12 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wider">Вернуться к комплексному лечению</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Package info - 8 columns */}
            <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-arista-light mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-forest-100">
                  {packageItem.name}
                </h1>

                <div className="flex items-center text-xl mb-8">
                  <Clock size={20} className="text-forest-400 mr-3" />
                  <span className="text-gray-200">{packageItem.totalDuration}</span>

                  <div className="h-4 w-px bg-gray-600 mx-6"></div>

                  <span className="text-2xl font-light text-white">
                    {packageItem.packagePrice.toLocaleString("ru-RU")} сум
                  </span>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl font-light">
                  {packageItem.detailedDescription || packageItem.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Link
                    href="/contact"
                    className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 shadow-lg shadow-forest-500/20 group"
                  >
                    <Calendar size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                    Записаться на прием
                  </Link>

                  <Link
                    href="/contact"
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group"
                  >
                    <Phone size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                    Получить консультацию
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Details section with luxury styling */}
      <section className="py-24 bg-gradient-to-b from-[#001d1c] to-[#002a27]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content - 2 columns */}
            <div className="lg:col-span-2 space-y-16">
              {/* Included Services */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Включенные услуги</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageItem.includedServices.map((service) => (
                    <div
                      key={service.serviceId}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{service.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Suitable For */}
              {packageItem.suitableFor && packageItem.suitableFor.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                    <h2 className="text-3xl font-arista-light mx-6">Кому подойдет</h2>
                    <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageItem.suitableFor.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start">
                          <CheckCircle size={18} className="text-forest-400 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Treatment Process */}
              {packageItem.process && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                    <h2 className="text-3xl font-arista-light mx-6">Процесс лечения</h2>
                    <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
                  </div>

                  <div className="relative border-l border-forest-500/30 pl-12 ml-6 space-y-16">
                    {packageItem.process.map((step) => (
                      <div key={step.step} className="relative">
                        <div className="absolute -left-[49px] top-0 w-10 h-10 rounded-full bg-gradient-to-br from-forest-500 to-forest-400 flex items-center justify-center text-lg font-bold">
                          {step.step}
                        </div>
                        <h3 className="text-2xl font-medium mb-4 text-white">{step.title}</h3>
                        <p className="text-lg text-gray-300 font-light leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 1 column with enhanced visual elements */}
            <motion.div
              className="lg:col-span-1 space-y-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Specialists — real team roster from /team */}
              {specialists.length > 0 && (
                <div className="bg-gradient-to-br from-[#002a27] to-[#003932] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                  <div className="h-1 bg-gradient-to-r from-forest-500 to-forest-400"></div>
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-6 text-white">Наши специалисты</h3>
                    <div className="space-y-6">
                      {specialists.map((specialist) => {
                        const initials = `${specialist.firstName?.[0] ?? ""}${specialist.lastName?.[0] ?? ""}`.toUpperCase();
                        return (
                          <Link
                            key={specialist.id}
                            href={`/team/${specialist.id}`}
                            className="flex items-center group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-forest-500/10 to-forest-400/10 p-0.5">
                              {specialist.photo ? (
                                <img
                                  src={specialist.photo}
                                  alt={`${specialist.firstName} ${specialist.lastName}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full rounded-lg bg-gray-700 flex items-center justify-center text-sm font-arista-light text-gray-400">
                                  {initials}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-lg group-hover:text-forest-400 transition-colors">
                                {specialist.firstName} {specialist.lastName}
                              </div>
                              <div className="text-gray-400">{specialist.roleTitle ?? specialist.role}</div>
                            </div>
                          </Link>
                        );
                      })}

                      <Link
                        href="/team"
                        className="flex items-center justify-center py-3 text-forest-400 hover:text-forest-300 transition-colors group"
                      >
                        <span>Все специалисты</span>
                        <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Related packages with luxury styling */}
              {relatedPackages.length > 0 && (
                <div className="bg-gradient-to-br from-[#002a27] to-[#003932] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                  <div className="h-1 bg-gradient-to-r from-forest-500 to-forest-400"></div>
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-6 text-white">Похожие программы</h3>
                    <div className="space-y-4">
                      {relatedPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          href={`/complex-treatment/${pkg.id}`}
                          className="block p-5 bg-gradient-to-br from-white/5 to-white/8 rounded-xl hover:from-white/8 hover:to-white/10 transition-all duration-300 border border-white/5 group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white mb-2 group-hover:text-forest-400 transition-colors">{pkg.name}</h4>
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock size={14} className="mr-1" />
                                <span>{pkg.totalDuration}</span>
                              </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/10 text-white">
                              {pkg.packagePrice.toLocaleString("ru-RU")} сум
                            </div>
                          </div>
                        </Link>
                      ))}

                      <Link
                        href="/complex-treatment"
                        className="flex items-center justify-center py-3 text-forest-400 hover:text-forest-300 transition-colors group"
                      >
                        <span>Все программы</span>
                        <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <ContactWithUs
        title="Готовы начать комплексное лечение?"
        description="Наши специалисты ответят на все ваши вопросы и подберут оптимальное время для визита. Мы гарантируем индивидуальный подход и высочайшее качество обслуживания."
        needsConsultation={false}
        setIsHowItWorksModalOpen={() => {}}
      />
    </div>
  );
};

export default PackageDetailPageBody;
