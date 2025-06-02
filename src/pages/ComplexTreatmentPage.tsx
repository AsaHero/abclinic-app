// src/pages/ComplexTreatmentPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Phone, ChevronRight } from 'lucide-react';

// Updated data structure
interface TreatmentPackage {
  id: string;
  name: string;
  description: string;
  includedServices: string[];
  suitableFor: string[];
  totalDuration: string;
  price: number;
  category: string;
}

interface PackageCategory {
  id: string;
  title: string;
}

// Sample categories
const packageCategories: PackageCategory[] = [
  { id: 'aesthetic', title: 'Эстетическая стоматология' },
  { id: 'treatment', title: 'Лечение и профилактика' },
  { id: 'prosthetics', title: 'Протезирование' },
  { id: 'surgery', title: 'Хирургические услуги' },
];

// Sample packages
const treatmentPackages: TreatmentPackage[] = [
  {
    id: 'smile-makeover',
    name: 'Комплексное преображение улыбки',
    description:
      'Полное преобразование вашей улыбки с использованием современных технологий и материалов.',
    includedServices: [
      'Профессиональная чистка зубов',
      'Отбеливание зубов системой Zoom',
      'Установка 6 виниров на передние зубы',
    ],
    suitableFor: [
      'Для подготовки к важным событиям',
      'При желании кардинально изменить внешний вид улыбки',
      'Для устранения нескольких эстетических проблем одновременно',
    ],
    totalDuration: '3-4 недели',
    price: 85000,
    category: 'aesthetic',
  },
  {
    id: 'hollywood-smile',
    name: 'Голливудская улыбка',
    description: 'Создание безупречной улыбки с помощью керамических виниров премиум-класса.',
    includedServices: [
      'Детальная 3D-диагностика',
      'Профессиональная чистка зубов',
      'Дизайн улыбки с визуализацией результата',
      'Установка 10 керамических виниров',
    ],
    suitableFor: [
      'Для людей, стремящихся к идеальной улыбке',
      'При наличии эстетических дефектов зубов',
      'Для тех, кто ценит долговечность результата',
    ],
    totalDuration: '2-3 месяца',
    price: 150000,
    category: 'aesthetic',
  },
  {
    id: 'caries-treatment',
    name: 'Комплексное лечение кариеса',
    description: 'Полное лечение кариеса с восстановлением зубов современными материалами.',
    includedServices: [
      'Диагностика и консультация',
      'Лечение до 4 зубов с кариесом средней глубины',
      'Композитные пломбы светового отверждения',
      'Полировка и шлифовка пломб',
    ],
    suitableFor: [
      'При множественном кариесе',
      'Для профилактики осложнений кариеса',
      'Для восстановления эстетики и функции зубов',
    ],
    totalDuration: '1-2 недели',
    price: 24000,
    category: 'treatment',
  },
  {
    id: 'periodontal-treatment',
    name: 'Комплексное лечение десен',
    description: 'Лечение заболеваний десен и профилактика их рецидивов.',
    includedServices: [
      'Диагностика состояния тканей пародонта',
      'Удаление зубных отложений ультразвуком',
      'Лазерная обработка пародонтальных карманов',
      'Медикаментозная терапия',
    ],
    suitableFor: [
      'При кровоточивости десен',
      'При хроническом гингивите или пародонтите',
      'Для профилактики потери зубов',
    ],
    totalDuration: '2-3 недели',
    price: 18000,
    category: 'treatment',
  },
  {
    id: 'implant-single',
    name: 'Имплантация одного зуба "под ключ"',
    description: 'Полное восстановление отсутствующего зуба с помощью имплантата и коронки.',
    includedServices: [
      '3D-диагностика и планирование имплантации',
      'Установка имплантата премиум-класса',
      'Заживляющий абатмент',
      'Металлокерамическая коронка на имплантате',
    ],
    suitableFor: [
      'При отсутствии одного зуба',
      'Для восстановления жевательной функции',
      'Для сохранения эстетики улыбки',
    ],
    totalDuration: '3-6 месяцев',
    price: 65000,
    category: 'prosthetics',
  },
  {
    id: 'prosthesis-removable',
    name: 'Комплексное протезирование съемными протезами',
    description: 'Восстановление зубного ряда с помощью современных съемных протезов.',
    includedServices: [
      'Консультация и планирование протезирования',
      'Подготовка полости рта',
      'Изготовление съемного протеза из современных материалов',
      'Фиксация и коррекция протеза',
    ],
    suitableFor: [
      'При множественной потере зубов',
      'При невозможности установки имплантатов',
      'Для восстановления жевательной функции',
    ],
    totalDuration: '2-4 недели',
    price: 45000,
    category: 'prosthetics',
  },
  {
    id: 'wisdom-teeth-removal',
    name: 'Удаление зубов мудрости',
    description: 'Профессиональное удаление от 1 до 4 зубов мудрости.',
    includedServices: [
      'Панорамный снимок и диагностика',
      'Удаление зубов мудрости',
      'Противовоспалительная терапия',
      'Контрольный осмотр',
    ],
    suitableFor: [
      'При проблемах с прорезыванием зубов мудрости',
      'При неправильном положении зубов мудрости',
      'Для профилактики осложнений',
    ],
    totalDuration: '1-2 недели',
    price: 20000,
    category: 'surgery',
  },
  {
    id: 'sinus-lift',
    name: 'Синус-лифтинг и костная пластика',
    description: 'Подготовка к имплантации путем увеличения объема костной ткани.',
    includedServices: [
      '3D-диагностика',
      'Операция по наращиванию костной ткани',
      'Использование биосовместимых материалов',
      'Послеоперационное ведение',
    ],
    suitableFor: [
      'При недостаточном объеме костной ткани',
      'При планировании имплантации в боковых отделах верхней челюсти',
      'При атрофии костной ткани',
    ],
    totalDuration: '4-6 месяцев',
    price: 35000,
    category: 'surgery',
  },
];

// Helper functions
const getPackagesByCategory = (categoryId: string) => {
  return treatmentPackages.filter((pkg) => pkg.category === categoryId);
};

// Package Card Component
const PackageCard = ({ packageItem }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
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
            {packageItem.includedServices.map((service, index) => (
              <li key={index} className="text-gray-400 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable for */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white/80 mb-2">Кому подойдет:</h4>
          <ul className="space-y-1">
            {packageItem.suitableFor.map((item, index) => (
              <li key={index} className="text-gray-400 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer section */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">Длительность: {packageItem.totalDuration}</div>
            <div className="text-xl font-medium text-white">
              {packageItem.price.toLocaleString('ru-RU')} сум
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/complex-treatment/${packageItem.id}`}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium py-2 rounded-lg flex items-center justify-center transition-all"
            >
              Подробнее
            </Link>

            <Link
              to="/contact"
              className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium py-2 rounded-lg flex items-center justify-center transition-all group"
            >
              <span>Записаться</span>
              <ChevronRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Category Section Component
const CategorySection = ({ category, packages }) => {
  if (packages.length === 0) return null;

  return (
    <section className="py-12 first:pt-6 last:pb-6">
      <h2 className="text-2xl font-arista-light mb-8">{category.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((packageItem) => (
          <PackageCard key={packageItem.id} packageItem={packageItem} />
        ))}
      </div>
    </section>
  );
};

// Main page component
const ComplexTreatmentPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#171b21] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero section */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#1A1E24] to-[#171b21]">
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
            Оптимальные решения для комплексных стоматологических проблем. Наши программы
            разработаны специалистами для максимальной эффективности лечения.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Render each category and its packages */}
        {packageCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            packages={getPackagesByCategory(category.id)}
          />
        ))}

        {/* Link to individual services */}
        <motion.div
          className="text-center py-16 mt-8 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-300 mb-6">Ищете отдельные услуги вместо комплексного решения?</p>
          <Link
            to="/services"
            className="inline-flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 group"
          >
            <span>Перейти к списку всех услуг</span>
            <ChevronRight
              size={18}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

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
                  Не уверены, какой пакет выбрать?
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Запишитесь на бесплатную консультацию к нашим специалистам. Мы поможем подобрать
                  оптимальное решение для ваших стоматологических потребностей.
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
    </motion.div>
  );
};

export default ComplexTreatmentPage;
