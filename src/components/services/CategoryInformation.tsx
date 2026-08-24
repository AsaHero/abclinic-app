"use client";

// src/components/services/CategoryInformation.tsx
import React from "react";
import Link from "next/link";
import { AlertTriangle, Calendar, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryInformationProps {
  requiresConsultation?: boolean;
  onToggleClientType: (isNew: boolean) => void;
  setIsHowItWorksModalOpen: (isOpen: boolean) => void;
}

const CategoryInformation: React.FC<CategoryInformationProps> = ({
  requiresConsultation,
  setIsHowItWorksModalOpen,
}) => {
  return (
    <motion.div
      className="mb-8 rounded-xl overflow-hidden border border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {requiresConsultation && (
        <div className="relative">
          {/* Accent top border */}
          <div className="h-1 w-full bg-gradient-to-r from-forest-500 to-forest-400"></div>

          <div className="p-6 bg-gradient-to-br from-[#002a27]/95 to-[#003932]/95 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-red-500/20 text-red-400 flex-shrink-0 mt-1">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-2">Требуется консультация</h3>
                <p className="text-gray-300 mb-4">
                  Для услуг в данной категории необходима предварительная консультация и диагностика. Это важный
                  шаг, позволяющий составить персональный план лечения и гарантировать наилучший результат.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <Link
                    href="/services/consult-diagnostic"
                    className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500
                    text-white font-medium px-5 py-3 rounded-lg inline-flex items-center justify-center
                    transition-all shadow-lg hover:shadow-forest-500/20"
                  >
                    <Calendar size={18} className="mr-2" />
                    Записаться на консультацию
                  </Link>
                  <button
                    className="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3
                    rounded-lg inline-flex items-center justify-center transition-all border border-white/5"
                    aria-label="Показать информацию о процессе консультации"
                    onClick={() => setIsHowItWorksModalOpen(true)}
                  >
                    <HelpCircle size={18} className="mr-2" />
                    Как проходит консультация
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryInformation;
