// src/components/FirstStepPromo.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Percent, Clock, Calendar } from 'lucide-react';
import { firstStepPackage } from '@/types/packageData';

interface FirstStepPromoProps {
  className?: string;
}

const FirstStepPromo: React.FC<FirstStepPromoProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-blue-600/20 to-teal-500/20 border border-blue-500/20 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:flex-1">
            <div className="flex items-center mb-3">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                Новым клиентам
              </span>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center">
                <Percent size={10} className="mr-1" />
                Экономия {firstStepPackage.discount}%
              </span>
            </div>

            <h3 className="text-2xl font-medium text-white mb-3">{firstStepPackage.name}</h3>

            <p className="text-gray-300 mb-4">{firstStepPackage.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-start">
                <div className="mt-1 mr-2 text-blue-400">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Продолжительность</p>
                  <p className="text-white">{firstStepPackage.totalDuration}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-2 text-green-400">
                  <Percent size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Стоимость</p>
                  <div className="flex items-center">
                    <span className="text-white font-medium">
                      {firstStepPackage.packagePrice.toLocaleString('ru-RU')} сум
                    </span>
                    <span className="text-gray-400 text-sm line-through ml-2">
                      {firstStepPackage.originalPrice.toLocaleString('ru-RU')} сум
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-white mb-2">Включает в себя:</p>
              <ul className="space-y-2">
                {firstStepPackage.includedServices.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{service.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={`/complex-treatment/${firstStepPackage.id}`}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-all w-full md:w-auto"
            >
              <Calendar size={18} className="mr-2" />
              <span>Записаться на пакет "Первый шаг"</span>
            </Link>
          </div>

          <div className="md:w-1/3 flex flex-col justify-between">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 h-full">
              <h4 className="text-white text-lg mb-3">Преимущества пакета:</h4>
              <ul className="space-y-2 mb-auto">
                {firstStepPackage.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={`/complex-treatment/${firstStepPackage.id}`}
                className="text-blue-400 hover:text-blue-300 mt-4 inline-flex items-center group text-sm"
              >
                <span>Подробнее о пакете</span>
                <ChevronRight
                  size={16}
                  className="ml-1 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FirstStepPromo;
