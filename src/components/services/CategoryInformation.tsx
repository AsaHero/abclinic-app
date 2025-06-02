// src/components/CategoryInformation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { InfoIcon, AlertTriangle, Calendar, HelpCircle, UserCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryInformationProps {
  categoryId: string;
  isNewClient: boolean;
  onToggleClientType: (isNew: boolean) => void;
  setIsHowItWorksModalOpen: (isOpen: boolean) => void;
}

const CategoryInformation: React.FC<CategoryInformationProps> = ({
  categoryId,
  setIsHowItWorksModalOpen,
}) => {
  // Different messages based on category type
  const requiresConsultation = categoryId !== 'consultation';

  if (categoryId === 'consultation') {
    return null; // No special message needed for the consultation category itself or "all" category
  }

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
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-teal-400"></div>

          <div className="p-6 bg-gradient-to-br from-[#1E2329]/95 to-[#252A32]/95 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-red-500/20 text-red-400 flex-shrink-0 mt-1">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-2">Требуется консультация</h3>
                <p className="text-gray-300 mb-4">
                  Для услуг в данной категории необходима предварительная консультация и
                  диагностика. Это важный шаг, позволяющий составить персональный план лечения и
                  гарантировать наилучший результат.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <Link
                    to="/services/consult-diagnostic"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500
                    text-white font-medium px-5 py-3 rounded-lg inline-flex items-center justify-center
                    transition-all shadow-lg hover:shadow-blue-500/20"
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
