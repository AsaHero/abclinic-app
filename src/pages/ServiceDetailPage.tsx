// src/pages/ServiceDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkAlert from 'remark-github-blockquote-alert';
import remarkBreaks from 'remark-breaks';

import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  Star,
  ChevronRight,
  AlertCircle,
  Info,
  Check,
} from 'lucide-react';

// Import service data and interfaces
import {
  allServices,
  serviceCategories,
  getRelatedServices,
  requiresConsultation,
  extraContent
} from '../types/serviceData';
import HowItWorksModal from '../components/services/HowItWorksModal';
import ContactWithUs from '@/components/common/ContactWithUs';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);

  // Find the service from our data
  const service = allServices.find((s) => s.id === serviceId);

  // Find the service category
  const category = service ? serviceCategories.find((cat) => cat.id === service.category) : null;

  // Get related services in the same category
  const relatedServices = service ? getRelatedServices(service.id, 3) : [];

  // Check if service requires consultation
  const needsConsultation = service ? requiresConsultation(service) : false;

  useEffect(() => {
    // If service not found, redirect to 404
    if (!service && !isLoading) {
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
  }, [service, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#171b21]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!service) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen pt-33 bg-[#171b21] text-white">
      {/* "How it works" modal */}
      <AnimatePresence>
        <HowItWorksModal
          isOpen={isHowItWorksModalOpen}
          onClose={() => setIsHowItWorksModalOpen(false)}
        />
      </AnimatePresence>

      {/* Back button and breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link to="/services" className="hover:text-white transition-colors">
            Услуги
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`/services?category=${service.category}`}
            className="hover:text-white transition-colors"
          >
            {category?.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{service.name}</span>
        </div>
      </div>

      {/* Enhanced Hero Section with Premium Image Background */}
      <motion.section
        className={`py-12 relative overflow-hidden ${
          service.heroImage
            ? 'min-h-[600px] flex items-center'
            : 'bg-gradient-to-r from-[#87f4b5]/0 to-[#93cbf1]'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image with Overlay */}
        {service.heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${service.heroImage})`,
                backgroundPosition: service.backgroundPosition || 'center center',
              }}
            />
            {/* Premium overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            {/* Subtle pattern overlay for texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
          </>
        )}

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-12 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wider">Вернуться к услугам</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Service info - full width when using background image */}
            <div className={service.heroImage ? 'lg:col-span-12 max-w-4xl' : 'lg:col-span-8'}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-arista-light mb-6 leading-tight ${
                    service.heroImage
                      ? 'text-white drop-shadow-2xl'
                      : 'bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100'
                  }`}
                >
                  {service.name}
                </h1>

                {/* Consultation requirement badge with enhanced styling for image backgrounds */}
                {service.category !== 'consultation' && (
                  <div className="flex items-center space-x-3 mb-6">
                    {service.includesConsultation ? (
                      <div
                        className={`px-3 py-2 rounded-lg flex items-center text-sm backdrop-blur-sm ${
                          service.heroImage
                            ? 'bg-green-500/30 text-green-200 border border-green-400/20'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        <Check size={16} className="mr-2" />
                        Включает консультацию
                      </div>
                    ) : needsConsultation ? (
                      <div
                        className={`px-3 py-2 rounded-lg flex items-center text-sm backdrop-blur-sm ${
                          service.heroImage
                            ? 'bg-orange-500/30 text-orange-200 border border-orange-400/20'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        <AlertCircle size={16} className="mr-2" />
                        Требуется предварительная консультация
                        <button
                          className={`ml-2 underline transition-colors ${
                            service.heroImage
                              ? 'text-orange-100 hover:text-orange-50'
                              : 'text-orange-300 hover:text-orange-200'
                          }`}
                          onClick={() => setIsHowItWorksModalOpen(true)}
                        >
                          Почему?
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`px-3 py-2 rounded-lg flex items-center text-sm backdrop-blur-sm ${
                          service.heroImage
                            ? 'bg-blue-500/30 text-blue-200 border border-blue-400/20'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        <Info size={16} className="mr-2" />
                        Можно записаться напрямую
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center text-xl mb-8">
                  <Clock
                    size={20}
                    className={`mr-3 ${service.heroImage ? 'text-blue-300' : 'text-blue-400'}`}
                  />
                  <span className={service.heroImage ? 'text-gray-100' : 'text-gray-200'}>
                    {service.duration}
                  </span>

                  <div
                    className={`h-4 w-px mx-6 ${service.heroImage ? 'bg-gray-400' : 'bg-gray-600'}`}
                  ></div>

                  <span
                    className={`text-2xl font-light ${service.heroImage ? 'text-white drop-shadow-lg' : 'text-white'}`}
                  >
                    {service.price.toLocaleString('ru-RU')} сум
                  </span>
                </div>

                {/* Enhanced description with better contrast for image backgrounds */}
                <p
                  className={`text-xl leading-relaxed mb-10 max-w-3xl font-light ${
                    service.heroImage ? 'text-gray-100 drop-shadow-lg' : 'text-gray-300'
                  }`}
                >
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  {/* Enhanced CTAs with better styling for image backgrounds */}
                  {service.includesConsultation || service.category === 'consultation' ? (
                    <Link
                      to="/contact"
                      className={`font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group ${
                        service.heroImage
                          ? 'bg-white/90 hover:bg-white text-gray-900 shadow-2xl backdrop-blur-sm border border-white/20'
                          : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      <Calendar
                        size={18}
                        className="mr-3 group-hover:scale-110 transition-transform"
                      />
                      Записаться на прием
                    </Link>
                  ) : needsConsultation ? (
                    <>
                      <Link
                        to="/services/consult-general"
                        className={`font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group ${
                          service.heroImage
                            ? 'bg-white/90 hover:bg-white text-gray-900 shadow-2xl backdrop-blur-sm border border-white/20'
                            : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white shadow-lg shadow-blue-500/20'
                        }`}
                      >
                        <Calendar
                          size={18}
                          className="mr-3 group-hover:scale-110 transition-transform"
                        />
                        Записаться на консультацию
                      </Link>
                      <button
                        onClick={() => setIsHowItWorksModalOpen(true)}
                        className={`font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group ${
                          service.heroImage
                            ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white'
                        }`}
                      >
                        <Info
                          size={18}
                          className="mr-3 group-hover:scale-110 transition-transform"
                        />
                        Как это работает
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/contact"
                      className={`font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group ${
                        service.heroImage
                          ? 'bg-white/90 hover:bg-white text-gray-900 shadow-2xl backdrop-blur-sm border border-white/20'
                          : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      <Calendar
                        size={18}
                        className="mr-3 group-hover:scale-110 transition-transform"
                      />
                      Записаться на прием
                    </Link>
                  )}

                  <Link
                    to="/contact"
                    className={`font-medium px-8 py-4 rounded-lg inline-flex items-center justify-center transition-all duration-300 group ${
                      service.heroImage
                        ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white'
                    }`}
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
              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                key="description"
              >
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Описание услуги</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                </div>

                {service.detailedDescription ? (
                  <div
                    className="prose prose-lg prose-invert max-w-none
    prose-headings:text-white prose-headings:font-medium prose-headings:mb-4
    prose-p:text-gray-300 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4
    prose-strong:text-white prose-strong:font-semibold
    prose-em:text-blue-200 prose-em:italic
    prose-blockquote:text-blue-300 prose-blockquote:border-l-blue-500 prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic
    prose-ul:text-gray-300 prose-ul:mb-4
    prose-ol:text-gray-300 prose-ol:mb-4
    prose-li:text-gray-300 prose-li:mb-2
    prose-code:text-blue-300 prose-code:bg-blue-900/20 prose-code:px-2 prose-code:py-1 prose-code:rounded
    prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
    prose-hr:border-gray-600
    prose-table:text-gray-300
    prose-thead:text-white
    prose-th:border-gray-600
    prose-td:border-gray-700"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkAlert, remarkBreaks]}
                      components={{
                        // Custom components for better styling
                        h1: ({ children }) => (
                          <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-semibold text-white mb-4 mt-8">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-medium text-white mb-3 mt-6">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-lg text-gray-300 mb-4 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => <li className="text-gray-300">{children}</li>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-blue-200 bg-blue-900/10 py-4 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-sm">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto my-6">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {service.detailedDescription}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="text-xl leading-relaxed text-gray-300 font-light">
                      {service.description}
                    </p>
                    <p className="text-xl leading-relaxed text-gray-300 font-light">
                      Мы используем современные технологии и материалы высочайшего качества, чтобы
                      обеспечить максимальный комфорт и долговечность результата.
                    </p>
                    <p className="text-xl leading-relaxed text-gray-300 font-light">
                      Наши специалисты прошли обучение в ведущих учебных центрах и регулярно
                      повышают свою квалификацию, чтобы быть в курсе последних достижений в области
                      стоматологии.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* FAQ Section */}
              {service.faqs && service.faqs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  key="faq"
                >
                  <div className="flex items-center mb-8">
                    <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <h2 className="text-3xl font-arista-light mx-6">Часто задаваемые вопросы</h2>
                    <div className="h-px flex-grow bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                  </div>

                  <div className="space-y-8">
                    {service.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/8 transition-colors"
                      >
                        <h3 className="text-xl font-medium mb-3 text-white">{faq.question}</h3>
                        <p className="text-lg text-gray-300 font-light">{faq.answer}</p>
                      </div>
                    ))}

                    {needsConsultation && !service.includesConsultation && (
                      <div className="bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-xl font-medium mb-3 text-white flex items-center">
                          <AlertCircle size={20} className="mr-2 text-orange-400" />
                          Почему нужна предварительная консультация?
                        </h3>
                        <p className="text-lg text-gray-300 font-light mb-4">
                          Для этой услуги предварительная консультация необходима, чтобы:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-orange-400 mt-1 mr-2 flex-shrink-0" />
                            <span>Оценить ваше текущее состояние и сделать необходимые снимки</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-orange-400 mt-1 mr-2 flex-shrink-0" />
                            <span>Разработать персонализированный план лечения</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-orange-400 mt-1 mr-2 flex-shrink-0" />
                            <span>Обсудить ожидаемые результаты и возможные альтернативы</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle2 className="w-5 h-5 text-orange-400 mt-1 mr-2 flex-shrink-0" />
                            <span>Рассчитать точную стоимость и длительность лечения</span>
                          </li>
                        </ul>
                        <div className="mt-4 flex space-x-4">
                          <Link
                            to="/services/consult-general"
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            Подробнее о консультации
                          </Link>
                          <button
                            onClick={() => setIsHowItWorksModalOpen(true)}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            Как проходит лечение
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - 1 column with enhanced visual elements */}
            <motion.div>
              <div className="bg-gradient-to-br from-[#1E2329] to-[#252A32] rounded-xl overflow-hidden shadow-xl shadow-black/20">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                <div className="p-8">
                  <h3 className="text-2xl font-medium mb-6 text-white">Похожие услуги</h3>
                  <div className="space-y-4">
                    {relatedServices.map((relatedService) => (
                      <Link
                        key={relatedService.id}
                        to={`/services/${relatedService.id}`}
                        className="block p-5 bg-gradient-to-br from-white/5 to-white/8 rounded-xl hover:from-white/8 hover:to-white/10 transition-all duration-300 border border-white/5 group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                              {relatedService.name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-400">
                              <Clock size={14} className="mr-1" />
                              <span>{relatedService.duration}</span>
                            </div>
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-white/10 text-white">
                            {relatedService.price.toLocaleString('ru-RU')} сум
                          </div>
                        </div>
                      </Link>
                    ))}

                    <Link
                      to={`/services?category=${service.category}`}
                      className="flex items-center justify-center py-3 text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <span>Все услуги категории</span>
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

      {/* Call to Action */}
      <section className="py-24 relative">
        <ContactWithUs
          title={
            needsConsultation
              ? 'Нужна консультация перед началом лечения?'
              : 'Готовы записаться на прием?'
          }
          description={
            needsConsultation
              ? `Запишитесь на консультацию, чтобы наши специалисты могли оценить вашу ситуацию, составить план лечения и рассчитать точную стоимость услуги. Это необходимый первый шаг для достижения наилучшего результата.`
              : `Наши специалисты ответят на все ваши вопросы и подберут оптимальное время для визита. Мы гарантируем индивидуальный подход и высочайшее качество обслуживания.`
          }
          needsConsultation={needsConsultation}
          setIsHowItWorksModalOpen={setIsHowItWorksModalOpen}
        />
      </section>
    </div>
  );
};

export default ServiceDetailPage;
