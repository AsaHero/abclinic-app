import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Clock, Calendar, FileText, Check, Gift, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-[#1E2329] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-arista-light text-white">Как проходит лечение</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Step 1: Consultation */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="absolute top-12 bottom-0 left-1/2 w-px bg-gray-700 -translate-x-1/2"></div>
              </div>

              <div className="ml-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-medium text-white">Шаг 1: Консультация</h3>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/services/consult-general');
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Подробнее
                  </button>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                    200,000 сум
                  </span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>15-20 мин</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">
                  Первичный осмотр, обсуждение ваших целей и предварительная оценка ситуации.
                </p>
                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Осмотр полости рта</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Сбор анамнеза и пожеланий</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2: Diagnostics with Pricing Logic */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="absolute top-12 bottom-0 left-1/2 w-px bg-gray-700 -translate-x-1/2"></div>
              </div>

              <div className="ml-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-medium text-white">
                    Шаг 2: Диагностика и план лечения
                  </h3>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/services/consult-diagnostic');
                    }}
                    className="text-sm text-green-400 hover:text-green-300 underline"
                  >
                    Подробнее
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                    300,000 сум
                  </span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>60-90 мин</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-3">
                  Комплексное обследование и составление детального плана лечения.
                </p>

                {/* Compact Pricing Logic */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Gift className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 font-medium text-sm">Бесплатно</span>
                    </div>
                    <p className="text-gray-300 text-xs">при продолжении лечения</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <AlertCircle className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="text-orange-400 font-medium text-sm">300,000 сум</span>
                    </div>
                    <p className="text-gray-300 text-xs">только диагностика</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Рентген и фотопротокол</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">План лечения с ценами</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3: Treatment */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
              </div>

              <div className="ml-6">
                <h3 className="text-xl font-medium text-white mb-2">Шаг 3: Начало лечения</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                    Согласно плану
                  </span>
                </div>
                <p className="text-gray-300 mb-3">
                  Выполнение всех процедур согласно утвержденному плану лечения.
                </p>
                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Современные технологии</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Контроль качества</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-blue-200 text-sm text-center">
                💡 <strong>Экономия:</strong> Диагностика бесплатно при продолжении лечения в
                клинике
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/services/consult-general');
                }}
                className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-all"
              >
                <Calendar size={18} className="mr-2" />
                Записаться на консультацию
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/services/consult-diagnostic');
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-all"
              >
                <FileText size={18} className="mr-2" />
                Подробнее о диагностике
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorksModal;
