"use client";

// src/components/services/ComplexTreatmentPageBody.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TreatmentPackage } from "@/types/packageData";
import ConsultationCTA from "@/components/common/ConsultationCTA";

// Package Card Component
const PackageCard: React.FC<{ packageItem: TreatmentPackage }> = ({ packageItem }) => {
  const hasDiscount = packageItem.originalPrice > packageItem.packagePrice;

  return (
    <motion.div
      className="bg-gradient-to-br from-[#002a27] to-[#003932] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.01 }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header section */}
        <div className="mb-4">
          <h3 className="text-xl font-medium text-white mb-2">{packageItem.name}</h3>
          <p className="text-gray-300">{packageItem.description}</p>
        </div>

        {/* Included services */}
        <div className="mb-4 flex-grow">
          <h4 className="text-sm font-medium text-white/80 mb-2">Включенные услуги:</h4>
          <ul className="space-y-1">
            {packageItem.includedServices.map((service) => (
              <li key={service.serviceId} className="text-gray-400 flex items-start">
                <span className="text-forest-400 mr-2">•</span>
                <span>{service.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable for */}
        {packageItem.suitableFor && packageItem.suitableFor.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white/80 mb-2">Кому подойдет:</h4>
            <ul className="space-y-1">
              {packageItem.suitableFor.map((item, index) => (
                <li key={index} className="text-gray-400 flex items-start">
                  <span className="text-forest-400 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">Длительность: {packageItem.totalDuration}</div>
            <div className="text-right">
              <div className="text-xl font-medium text-white">
                {packageItem.packagePrice.toLocaleString("ru-RU")} сум
              </div>
              {hasDiscount && (
                <div className="text-xs text-gray-500 line-through">
                  {packageItem.originalPrice.toLocaleString("ru-RU")} сум
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/complex-treatment/${packageItem.id}`}
              className="w-full bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium py-2 rounded-lg flex items-center justify-center transition-all"
            >
              Подробнее
            </Link>

            <Link
              href="/contact"
              className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium py-2 rounded-lg flex items-center justify-center transition-all group"
            >
              <span>Записаться</span>
              <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ComplexTreatmentPageBodyProps {
  packages: TreatmentPackage[];
}

// Main page body component
const ComplexTreatmentPageBody: React.FC<ComplexTreatmentPageBodyProps> = ({ packages }) => {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#001d1c] text-white">
      {/* Hero section */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#002a27] to-[#001d1c]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Page title */}
            <motion.h1
              className="text-5xl md:text-6xl font-arista-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Комплексное лечение
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl text-gray-300 mt-6 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Оптимальные решения для комплексных стоматологических проблем. Наши программы разработаны специалистами
            для максимальной эффективности лечения.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        <section className="py-12 first:pt-6 last:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((packageItem) => (
              <PackageCard key={packageItem.id} packageItem={packageItem} />
            ))}
          </div>
        </section>

        {/* Link to individual services */}
        <motion.div
          className="text-center py-16 mt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-300 mb-6">Ищете отдельные услуги вместо комплексного решения?</p>
          <Link
            href="/services"
            className="inline-flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 group"
          >
            <span>Перейти к списку всех услуг</span>
            <ChevronRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <ConsultationCTA
        title="Не уверены, какой пакет выбрать?"
        description="Запишитесь на бесплатную консультацию к нашим специалистам. Мы поможем подобрать оптимальное решение для ваших стоматологических потребностей."
      />
    </div>
  );
};

export default ComplexTreatmentPageBody;
