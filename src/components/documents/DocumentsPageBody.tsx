"use client";

// src/components/documents/DocumentsPageBody.tsx
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileType2,
  ArrowRight,
  CheckCircle,
  Info,
  AlertCircle,
  Clock,
  IdCard,
  FileStack,
  Pill,
  Utensils,
  Shirt,
  PhoneCall,
  ListChecks,
} from "lucide-react";

// Same document set as the homepage InfoDocumentsSection — kept self-contained here
// rather than imported, so this page doesn't depend on a homepage component.
interface InfoDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  icon: React.ReactNode;
  downloadable?: boolean;
  category?: string;
}

const infoDocuments: InfoDocument[] = [
  {
    id: "doc1",
    title: "Информация для новых клиентов",
    description: "Важная информация для пациентов, которые посещают нашу клинику впервые.",
    fileUrl: "/documents/info-for-clients.pdf",
    icon: <Info size={28} />,
    downloadable: true,
    category: "Рекомендации",
  },
  {
    id: "doc2",
    title: "Права пациентов",
    description: "Ознакомьтесь с вашими правами как пациента нашей клиники.",
    fileUrl: "/documents/patient-rights.pdf",
    icon: <FileType2 size={28} />,
    downloadable: true,
    category: "Правовая информация",
  },
  {
    id: "doc3",
    title: "Подготовка к приему",
    description: "Рекомендации по подготовке к различным видам стоматологического лечения.",
    fileUrl: "/documents/visit-preparation.pdf",
    icon: <CheckCircle size={28} />,
    downloadable: true,
    category: "Рекомендации",
  },
  {
    id: "doc4",
    title: "Страховая политика",
    description: "Информация о работе со страховыми компаниями и возмещении расходов.",
    fileUrl: "/documents/insurance-policy.pdf",
    icon: <AlertCircle size={28} />,
    downloadable: true,
    category: "Финансы",
  },
];

const DocumentCard = ({ document, index }: { document: InfoDocument; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.a
      ref={cardRef}
      key={document.id}
      href={document.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#002a27] rounded-xl p-8 flex flex-col min-h-[240px]
        hover:bg-[#003932] transition-all hover:-translate-y-1 duration-300
        border border-transparent hover:border-gray-700 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.15 * index }}
    >
      {document.category && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-500/10 text-forest-300">
            {document.category}
          </span>
        </div>
      )}

      <motion.div
        className="text-white/70 mb-auto relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 * index + 0.2 }}
      >
        {document.icon}
      </motion.div>

      <div className="mt-auto relative z-10">
        <h3 className="text-lg font-inter font-medium mt-4 mb-2 text-white group-hover:text-white/90 transition-colors">
          {document.title}
        </h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{document.description}</p>

        <div className="flex items-center text-sm text-forest-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="mr-2">Открыть документ</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute inset-0 bg-gradient-to-b from-forest-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L100 0 L100 100" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    </motion.a>
  );
};

interface ChecklistItem {
  icon: React.ReactNode;
  text: string;
}

const ChecklistCard = ({
  title,
  items,
  delay = 0,
}: {
  title: string;
  items: ChecklistItem[];
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      <h2 className="text-2xl font-arista-light mb-6">{title}</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <motion.li
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: delay + 0.1 + index * 0.08 }}
          >
            <span className="mr-4 mt-0.5 text-forest-400 shrink-0">{item.icon}</span>
            <span className="text-gray-300">{item.text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const beforeVisitItems: ChecklistItem[] = [
  {
    icon: <Clock size={20} />,
    text: "Приходите за 10–15 минут до начала приема, чтобы спокойно оформить документы.",
  },
  {
    icon: <IdCard size={20} />,
    text: "Возьмите с собой документ, удостоверяющий личность.",
  },
  {
    icon: <FileStack size={20} />,
    text: "Если есть — возьмите результаты предыдущих обследований, снимков или заключений врачей.",
  },
  {
    icon: <Pill size={20} />,
    text: "Сообщите администратору о принимаемых лекарствах и аллергиях, если они у вас есть.",
  },
  {
    icon: <Utensils size={20} />,
    text: "Поешьте за 1–2 часа до приема, если планируется анестезия.",
  },
];

const dayOfVisitItems: ChecklistItem[] = [
  {
    icon: <Shirt size={20} />,
    text: "Приходите в удобной одежде — это поможет чувствовать себя комфортно во время приема.",
  },
  {
    icon: <PhoneCall size={20} />,
    text: "При плохом самочувствии заранее предупредите клинику по телефону и перенесите визит.",
  },
  {
    icon: <ListChecks size={20} />,
    text: "Возьмите с собой список вопросов к врачу, если они у вас есть.",
  },
  {
    icon: <Clock size={20} />,
    text: "Рассчитывайте на то, что прием может занять больше времени, чем стандартная консультация.",
  },
];

export default function DocumentsPageBody() {
  const docsSectionRef = useRef(null);
  const isDocsInView = useInView(docsSectionRef, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen bg-[#001d1c] text-white pt-24">
      <div className="relative overflow-hidden bg-primary-900 pb-16">
        <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Подготовка к приему
          </motion.h1>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-forest-500 to-forest-400 mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="text-xl text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Несколько простых рекомендаций, которые помогут вам подготовиться к визиту и сделают
            прием максимально комфортным и эффективным.
          </motion.p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChecklistCard title="Перед приемом" items={beforeVisitItems} delay={0.1} />
          <ChecklistCard title="В день приема" items={dayOfVisitItems} delay={0.25} />
        </div>
      </div>

      <div
        ref={docsSectionRef}
        className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 pb-24 relative"
      >
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0 }}
          animate={isDocsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-inter font-light mb-4"
            initial={{ y: 40 }}
            animate={isDocsInView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Другие документы
          </motion.h2>

          <motion.div
            className="h-px w-0 bg-gradient-to-r from-forest-500/20 via-forest-500/60 to-forest-500/20 mt-4"
            initial={{ width: 0 }}
            animate={isDocsInView ? { width: "120px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isDocsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Полезные материалы и документы, с которыми стоит ознакомиться перед посещением
            клиники.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={isDocsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {infoDocuments.map((doc, index) => (
            <DocumentCard key={doc.id} document={doc} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
