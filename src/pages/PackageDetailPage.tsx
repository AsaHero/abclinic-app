// src/pages/PackageDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Calendar, Phone, Star, ChevronRight } from 'lucide-react';

// Import package data (this would be from your data file)
interface TreatmentPackage {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  includedServices: string[];
  suitableFor: string[];
  totalDuration: string;
  price: number;
  category: string;
  categoryTitle?: string;
  process?: {
    step: number;
    title: string;
    description: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
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

// Sample packages (expanded with additional details for the detail page)
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
      'Финальная коррекция и полировка',
      'Контрольный осмотр через 2 недели',
    ],
    suitableFor: [
      'Для подготовки к важным событиям (свадьба, юбилей)',
      'При желании кардинально изменить внешний вид улыбки',
      'Для устранения нескольких эстетических проблем одновременно',
      'При наличии изменений цвета эмали, не поддающихся обычному отбеливанию',
      'При незначительных нарушениях положения зубов',
    ],
    totalDuration: '3-4 недели',
    price: 85000,
    category: 'aesthetic',
    process: [
      {
        step: 1,
        title: 'Консультация и планирование',
        description:
          'Детальное обсуждение ваших пожеланий, компьютерное моделирование результата, составление индивидуального плана лечения.',
      },
      {
        step: 2,
        title: 'Профессиональная гигиена',
        description:
          'Тщательная чистка зубов с использованием ультразвука и Air Flow для подготовки к дальнейшим процедурам.',
      },
      {
        step: 3,
        title: 'Отбеливание зубов',
        description:
          'Процедура отбеливания по системе Zoom, позволяющая осветлить зубы на несколько тонов за одно посещение.',
      },
      {
        step: 4,
        title: 'Подготовка и установка виниров',
        description:
          'Минимальная препаровка зубов, снятие слепков, изготовление и установка высококачественных виниров.',
      },
      {
        step: 5,
        title: 'Финальная коррекция',
        description: 'Точная подгонка, шлифовка и полировка виниров для идеального результата.',
      },
    ],
    faqs: [
      {
        question: 'Как долго прослужат виниры?',
        answer:
          'При правильном уходе современные керамические виниры могут служить 10-15 лет и даже больше. Наши специалисты дадут вам подробные рекомендации по уходу за винирами.',
      },
      {
        question: 'Потребуется ли обточка зубов?',
        answer:
          'Для установки виниров требуется минимальная обточка эмали (около 0.3-0.5 мм) с передней поверхности зуба. В некоторых случаях возможна установка ультратонких виниров без препарирования.',
      },
      {
        question: 'Сколько времени занимает вся процедура?',
        answer:
          'Весь процесс от консультации до установки готовых виниров занимает 3-4 недели. Это время необходимо для качественного изготовления виниров в зуботехнической лаборатории.',
      },
      {
        question: 'Будет ли больно?',
        answer:
          'Все процедуры проводятся с применением современных анестетиков. Вы не будете испытывать боли во время лечения.',
      },
    ],
  },
  // Other packages would be defined here with similar detailed information
];

// Helper functions
const getPackageById = (id: string) => {
  const pkg = treatmentPackages.find((p) => p.id === id);
  if (pkg) {
    // Add category title to the package for convenience
    return {
      ...pkg,
      categoryTitle: packageCategories.find((cat) => cat.id === pkg.category)?.title,
    };
  }
  return null;
};

// Find related packages in the same category
const getRelatedPackages = (packageId: string, limit: number = 2) => {
  const currentPackage = treatmentPackages.find((p) => p.id === packageId);
  if (!currentPackage) return [];

  return treatmentPackages
    .filter((p) => p.category === currentPackage.category && p.id !== packageId)
    .slice(0, limit);
};

const PackageDetailPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Find the package from our data
  const packageItem = packageId ? getPackageById(packageId) : null;

  // Get related packages in the same category
  const relatedPackages = packageId ? getRelatedPackages(packageId) : [];

  // Sample specialists (would be from your data)
  const specialists = [
    { id: 1, name: 'Иванов Иван', position: 'Главный врач', rating: 5.0 },
    { id: 2, name: 'Петрова Мария', position: 'Стоматолог-терапевт', rating: 4.9 },
  ];

  // Sample testimonials (would be from your data)
  const testimonials = [
    {
      id: 1,
      text: 'Отличная клиника с профессиональным подходом. Результатом очень доволен! Особенно понравилось внимание к деталям.',
      author: 'Анна К.',
      rating: 5,
      date: '2 месяца назад',
    },
    {
      id: 2,
      text: 'Всё прошло безболезненно и комфортно. Врач подробно объяснил каждый этап процедуры.',
      author: 'Дмитрий Н.',
      rating: 4,
      date: '4 месяца назад',
    },
  ];

  useEffect(() => {
    // If package not found, redirect to 404
    if (!packageItem && !isLoading) {
      navigate('/not-found');
      return;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [packageItem, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#171b21]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!packageItem) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen pt-47 bg-[#171b21] text-white">
      {/* Back button and breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link to="/complex-treatment" className="hover:text-white transition-colors">
            Комплексное лечение
          </Link>
          <span className="mx-2">/</span>
          {packageItem.categoryTitle && (
            <>
              <Link
                to={`/complex-treatment?category=${packageItem.category}`}
                className="hover:text-white transition-colors"
              >
                {packageItem.categoryTitle}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-white">{packageItem.name}</span>
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <motion.section
        className="py-12 bg-gradient-to-r from-[#87f4b5]/0 to-[#93cbf1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <Link
            to="/complex-treatment"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-12 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wider">Вернуться к комплексному лечению</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Package info - 8 columns */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-arista-light mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  {packageItem.name}
                </h1>

                <div className="flex items-center text-xl mb-8">
                  <Clock size={20} className="text-blue-400 mr-3" />
                  <span className="text-gray-200">{packageItem.totalDuration}</span>

                  <div className="h-4 w-px bg-gray-600 mx-6"></div>

                  <span className="text-2xl font-light text-white">
                    {packageItem.price.toLocaleString('ru-RU')} сум
                  </span>
                </div>

                <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl font-light">
                  {packageItem.detailedDescription || packageItem.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Link
                    to="/contact"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-500/20 group"
                  >
                    <Calendar
                      size={18}
                      className="mr-3 group-hover:scale-110 transition-transform"
                    />
                    Записаться на прием
                  </Link>

                  <Link
                    to="/contact"
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
      <section className="py-24 bg-gradient-to-b from-[#171b21] to-[#1a1e24]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main content - 2 columns */}
            <div className="lg:col-span-2 space-y-16">
              {/* Included Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Включенные услуги</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageItem.includedServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{service}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Suitable For */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Кому подойдет</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageItem.suitableFor.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Treatment Process */}
              {packageItem.process && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <h2 className="text-3xl font-arista-light mx-6">Процесс лечения</h2>
                    <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                  </div>

                  <div className="relative border-l border-blue-500/30 pl-12 ml-6 space-y-16">
                    {packageItem.process.map((step) => (
                      <div key={step.step} className="relative">
                        <div className="absolute -left-[49px] top-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-lg font-bold">
                          {step.step}
                        </div>
                        <h3 className="text-2xl font-medium mb-4 text-white">{step.title}</h3>
                        <p className="text-lg text-gray-300 font-light leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQs */}
              {packageItem.faqs && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <h2 className="text-3xl font-arista-light mx-6">Часто задаваемые вопросы</h2>
                    <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                  </div>

                  <div className="space-y-8">
                    {packageItem.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/8 transition-colors"
                      >
                        <h3 className="text-xl font-medium mb-3 text-white">{faq.question}</h3>
                        <p className="text-lg text-gray-300 font-light">{faq.answer}</p>
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
              {/* Specialists with improved design */}
              <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-6 text-white">Наши специалисты</h3>
                  <div className="space-y-6">
                    {specialists.map((specialist) => (
                      <div key={specialist.id} className="flex items-center">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/10 to-teal-400/10 p-0.5">
                          <div className="w-full h-full rounded-xl bg-gray-700"></div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-lg">{specialist.name}</div>
                          <div className="text-gray-400">{specialist.position}</div>
                          <div className="mt-1 flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={`${star <= specialist.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'} mr-0.5`}
                              />
                            ))}
                            <span className="text-sm text-gray-400 ml-2">
                              {specialist.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Link
                      to="/team"
                      className="flex items-center justify-center py-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <span>Все специалисты</span>
                      <ChevronRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related packages with luxury styling */}
              {relatedPackages.length > 0 && (
                <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                  <div className="p-8">
                    <h3 className="text-2xl font-medium mb-6 text-white">Похожие программы</h3>
                    <div className="space-y-4">
                      {relatedPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          to={`/complex-treatment/${pkg.id}`}
                          className="block p-5 bg-gradient-to-br from-white/5 to-white/8 rounded-xl hover:from-white/8 hover:to-white/10 transition-all duration-300 border border-white/5 group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {pkg.name}
                              </h4>
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock size={14} className="mr-1" />
                                <span>{pkg.totalDuration}</span>
                              </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/10 text-white">
                              {pkg.price.toLocaleString('ru-RU')} сум
                            </div>
                          </div>
                        </Link>
                      ))}

                      <Link
                        to={`/complex-treatment`}
                        className="flex items-center justify-center py-3 text-blue-400 hover:text-blue-300 transition-colors group"
                      >
                        <span>Все программы</span>
                        <ChevronRight
                          size={16}
                          className="ml-1 transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials with enhanced design */}
              <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-6 text-white">Отзывы</h3>
                  <div className="space-y-6">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-6 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`${star <= testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'} mr-0.5`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 ml-2">{testimonial.date}</span>
                        </div>
                        <p className="text-white mb-4">"{testimonial.text}"</p>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 mr-2"></div>
                          <div className="text-sm font-medium">{testimonial.author}</div>
                        </div>
                      </div>
                    ))}

                    <Link
                      to="/reviews"
                      className="flex items-center justify-center py-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <span>Все отзывы</span>
                      <ChevronRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with luxury elements */}
      <section className="py-24 relative">
        {/* Gradient background with luxury pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1e24] to-[#131719]"></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'url(/assets/pattern.svg)' }}
        ></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
        <div className="absolute top-24 right-24 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-24 left-24 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <motion.div
            className="bg-gradient-to-br from-[#1e2329]/80 to-[#252a32]/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/5 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>

            <div className="p-12 md:p-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-arista-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Готовы начать комплексное лечение?
                </h2>

                <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light">
                  Наши специалисты ответят на все ваши вопросы и подберут оптимальное время для
                  визита. Мы гарантируем индивидуальный подход и высочайшее качество обслуживания.
                </p>

                <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                  <Link
                    to="/contact"
                    className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-500/20 group"
                  >
                    <Calendar
                      size={20}
                      className="mr-4 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-lg">Записаться на прием</span>
                  </Link>

                  <Link
                    to="/contact"
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 group"
                  >
                    <Phone size={20} className="mr-4 group-hover:scale-110 transition-transform" />
                    <span className="text-lg">Позвонить нам</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PackageDetailPage;
