// src/components/sections/InfoDocumentsSection.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, ArrowRight, CheckCircle, Info, AlertCircle, FileType2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Enhanced interfaces with more document details for premium presentation
interface InfoDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  icon: React.ReactNode;
  downloadable?: boolean;
  category?: string;
}

// Premium document data with enhanced detail
const infoDocuments: InfoDocument[] = [
  {
    id: 'doc1',
    title: 'Информация для новых клиентов',
    description: 'Важная информация для пациентов, которые посещают нашу клинику впервые.',
    fileUrl: '/documents/info-for-clients.pdf',
    icon: <Info size={28} />,
    downloadable: true,
    category: 'Рекомендации',
  },
  {
    id: 'doc2',
    title: 'Права пациентов',
    description: 'Ознакомьтесь с вашими правами как пациента нашей клиники.',
    fileUrl: '/documents/patient-rights.pdf',
    icon: <FileType2 size={28} />,
    downloadable: true,
    category: 'Правовая информация',
  },
  {
    id: 'doc3',
    title: 'Подготовка к приему',
    description: 'Рекомендации по подготовке к различным видам стоматологического лечения.',
    fileUrl: '/documents/visit-preparation.pdf',
    icon: <CheckCircle size={28} />,
    downloadable: true,
    category: 'Рекомендации',
  },
  {
    id: 'doc4',
    title: 'Страховая политика',
    description: 'Информация о работе со страховыми компаниями и возмещении расходов.',
    fileUrl: '/documents/insurance-policy.pdf',
    icon: <AlertCircle size={28} />,
    downloadable: true,
    category: 'Финансы',
  },
];

// Premium document card component with enhanced animations
const DocumentCard = ({ document, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.a
      ref={cardRef}
      key={document.id}
      href={document.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1e2329] rounded-xl p-8 flex flex-col min-h-[240px]
        hover:bg-[#252a32] transition-all hover:-translate-y-1 duration-300
        border border-transparent hover:border-gray-700 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 * index }}
    >
      {/* Premium category tag */}
      {document.category && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300">
            {document.category}
          </span>
        </div>
      )}

      {/* Premium icon animation */}
      <motion.div
        className="text-white/70 mb-auto relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 * index + 0.2 }}
      >
        {document.icon}
      </motion.div>

      {/* Premium content with enhanced typography */}
      <div className="mt-auto relative z-10">
        <h3 className="text-lg font-inter font-medium mt-4 mb-2 text-white group-hover:text-white/90 transition-colors">
          {document.title}
        </h3>

        {/* Description - new premium addition */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{document.description}</p>

        {/* Premium download indicator */}
        <div className="flex items-center text-sm text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="mr-2">Открыть документ</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>

      {/* Premium hover effect - subtle gradient */}
      <motion.div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Premium background pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L100 0 L100 100" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    </motion.a>
  );
};

const InfoDocumentsSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="pb-24 pt-16 bg-[#171b21] text-white w-full relative overflow-hidden"
    >
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

      {/* Premium subtle gradient accent */}
      <motion.div
        className="absolute top-0 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, 20, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Premium section header with enhanced animation */}
        <div className="mb-16">
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-inter font-light mb-4"
              initial={{ y: 40 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Ознакомьтесь с информацией
              <br />
              <span className="font-normal text-white">перед посещением клиники</span>
            </motion.h2>

            {/* Premium animated underline */}
            <motion.div
              className="h-px w-0 bg-gradient-to-r from-blue-500/20 via-blue-500/60 to-blue-500/20 mt-4"
              initial={{ width: 0 }}
              animate={isInView ? { width: '120px' } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Premium section description - new addition */}
          <motion.p
            className="text-lg text-gray-400 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Эти документы помогут вам лучше подготовиться к визиту и сделают ваше пребывание в
            клинике максимально комфортным.
          </motion.p>
        </div>

        {/* Premium document cards grid with enhanced layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {infoDocuments.map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} index={index} />
          ))}
        </motion.div>

        {/* Premium CTA - new addition */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Link
            to="/documents"
            className="group inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="mr-2">Смотреть все документы</span>
            <motion.div
              className="group-hover:translate-x-1 transition-transform"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Premium subtle gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
    </section>
  );
};

export default InfoDocumentsSection;
