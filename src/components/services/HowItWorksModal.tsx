import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Clock, Calendar, FileText, Check } from 'lucide-react';
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
          <div className="space-y-8">
            {/* Step 1: Consultation */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="absolute top-12 bottom-0 left-1/2 w-px bg-gray-700 -translate-x-1/2"></div>
              </div>

              <div className="ml-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-medium text-white">Шаг 1: Консультация</h3>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/services/consult-general');
                    }}
                    className="ml-2 text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Подробнее
                  </button>
                </div>
                <p className="text-gray-300 mb-3">
                  На первом приеме врач проведет осмотр, выслушает ваши пожелания и жалобы, а также
                  соберет необходимую информацию о вашем здоровье.
                </p>
                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">Первичный осмотр полости рта</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">Сбор анамнеза и выявление пожеланий</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2 flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Продолжительность: около 20 минут</span>
                </div>
              </div>
            </div>

            {/* Step 2: Combined Diagnostics & Treatment Plan */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="absolute top-12 bottom-0 left-1/2 w-px bg-gray-700 -translate-x-1/2"></div>
              </div>

              <div className="ml-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-medium text-white">
                    Шаг 2: Диагностика и план лечения
                  </h3>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/services/consult-diagnostic');
                    }}
                    className="ml-2 text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    Подробнее
                  </button>
                </div>
                <p className="text-gray-300 mb-3">
                  Комплексное обследование с использованием специальных методов диагностики, после
                  чего врач составит подробный план лечения с указанием всех необходимых процедур и
                  их стоимости.
                </p>
                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        Рентгенологическое обследование и фото-протокол
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">Подробное объяснение вашего состояния</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        Прозрачный план лечения с указанием стоимости
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-2 flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Продолжительность: до 1 часа</span>
                </div>
              </div>
            </div>

            {/* Step 3: Treatment */}
            <div className="flex">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
              </div>

              <div className="ml-6">
                <h3 className="text-xl font-medium text-white mb-2">Шаг 3: Начало лечения</h3>
                <p className="text-gray-300 mb-3">
                  После вашего согласия с планом лечения мы приступим к проведению необходимых
                  процедур согласно установленному графику.
                </p>
                <div className="bg-white/5 rounded-lg p-3">
                  <ul className="space-y-1.5">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        Использование современных технологий и материалов
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        Контроль качества на каждом этапе лечения
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-white text-center">
              Такой подход гарантирует качественное лечение, основанное на ваших индивидуальных
              потребностях.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/services/consult-general');
                }}
                className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center transition-all"
              >
                Записаться на консультацию
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/services/consult-diagnostic');
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-2.5 rounded-lg inline-flex items-center justify-center transition-all"
              >
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
