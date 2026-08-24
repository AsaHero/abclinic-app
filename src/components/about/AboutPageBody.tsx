"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  HeartPulse,
  Users,
  Award,
  Globe,
  ScanLine,
  Calendar,
  Phone,
  ArrowRight,
  Clock,
  HeartHandshake,
  ListChecks,
  Compass,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Timeline from "@/components/timeline/Timeline";
import { timelineData } from "@/types/timelineData";
import BookingButton from "@/components/common/BookingButton";
import PhotoGallerySection from "@/components/home/PhotoGallerySection";

const BenefitCard = ({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Sparkles;
  title: string;
  children: ReactNode;
  delay?: number;
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={cardRef}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-forest-900/5 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <div className="p-3 bg-forest-500/10 rounded-lg inline-flex mb-4">
        <Icon size={22} className="text-forest-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </motion.div>
  );
};

const benefits: { icon: typeof Sparkles; title: string; description: string }[] = [
  {
    icon: Sparkles,
    title: "Протокол GBT",
    description: "Guided Biofilm Therapy — золотой стандарт современной гигиены полости рта.",
  },
  {
    icon: HeartPulse,
    title: "Минимально инвазивный подход",
    description: "Сохраняем максимум здоровых тканей при лечении.",
  },
  {
    icon: Users,
    title: "Три поколения стоматологов",
    description: "Одна семья в профессии с 1936 года.",
  },
  {
    icon: Award,
    title: "Современный уровень хирургии",
    description: "Первая имплантация в клинике проведена в 2020 году.",
  },
  {
    icon: Globe,
    title: "Международный опыт",
    description: "В 2022 году — совместный благотворительный имплантологический проект с австралийскими хирургами.",
  },
  {
    icon: ScanLine,
    title: "Цифровая диагностика",
    description: "Фотопротокол на каждом приёме.",
  },
];

const values: { icon: typeof Sparkles; title: string; description: string }[] = [
  {
    icon: Clock,
    title: "Мы продаём не пломбы — мы продаём время",
    description:
      "Зуб — невосполнимый ресурс. Вылечить «раз и навсегда» невозможно, но каждый его этап можно продлить, не перескакивая через ступени.",
  },
  {
    icon: Compass,
    title: "Pro-aging, а не anti-aging",
    description:
      "Мы не боремся со старением и не обещаем универсальный идеал. Цель — максимум возможного именно в вашем случае, честно и без иллюзий.",
  },
  {
    icon: HeartHandshake,
    title: "Партнёрство, а не спасение",
    description:
      "За результат отвечаем вместе: мы — диагностика, протокол и контроль качества; вы — гигиена, привычки и визиты на поддерживающее лечение.",
  },
  {
    icon: ListChecks,
    title: "Четыре фильтра для каждого решения",
    description:
      "Научные данные, практический опыт, здравый смысл и ваша конкретная ситуация — ни один клинический выбор не строится на одном лишь мнении.",
  },
];

export default function AboutPageBody() {
  const [activeIndex, setActiveIndex] = useState(0);

  const historyRef = useRef(null);
  const isHistoryInView = useInView(historyRef, { once: true, amount: 0.2 });

  const benefitsRef = useRef(null);
  const isBenefitsInView = useInView(benefitsRef, { once: true, amount: 0.1 });

  const valuesRef = useRef(null);
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.1 });

  const fitRef = useRef(null);
  const isFitInView = useInView(fitRef, { once: true, amount: 0.2 });

  // Auto-advance the timeline, same as the homepage's TimelineSection.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#001d1c] text-white pt-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-primary-900 pb-16">
        <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            О клинике
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
            abclinic.uz — клиника восстановления зубов для взрослых, где современные технологии и бережный подход к
            лечению передаются вместе с делом из поколения в поколение.
          </motion.p>
        </div>
      </div>

      {/* Миссия */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <motion.p
          className="text-2xl md:text-4xl font-arista-light leading-snug max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          Мы существуем для тех, кто создаёт свою историю и помогает создавать истории других. Мы сохраняем
          здоровье, естественную красоту и жизненный ресурс — помогая раскрыть природный потенциал и прожить жизнь
          в своей лучшей форме.
        </motion.p>
        <motion.p
          className="text-gray-400 text-base md:text-lg max-w-2xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Великие истории создаются людьми. Великим людям нужен ресурс, чтобы их написать — мы помогаем этот ресурс
          сохранить.
        </motion.p>
      </div>

      {/* История клиники */}
      <div ref={historyRef} className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <motion.h2
            className="text-3xl md:text-5xl font-inter font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={isHistoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            История клиники
          </motion.h2>

          <motion.p
            className="md:max-w-md text-lg text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isHistoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Три поколения одной семьи в стоматологии — путь от самодельной установки в 1936 году до цифровой
            диагностики и имплантологии сегодня.
          </motion.p>
        </div>
      </div>

      <motion.div
        className="w-full max-w-screen-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isHistoryInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Timeline entries={timelineData} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </motion.div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 -mt-4 mb-8 flex justify-center md:justify-end">
        <Link
          href="/history"
          className="group inline-flex items-center gap-2 text-forest-400 hover:text-forest-300 transition-colors text-sm"
        >
          <span>Погрузиться в полную историю</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Галерея — id="gallery" is the anchor the homepage's compact photo strip links to */}
      <div id="gallery">
        <PhotoGallerySection />
      </div>

      {/* Преимущества */}
      <div ref={benefitsRef} className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-24">
        <motion.h2
          className="text-3xl md:text-5xl font-inter font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Преимущества
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          То, что отличает клинику, где опыт трёх поколений семьи сочетается с современными технологиями.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} icon={benefit.icon} title={benefit.title} delay={index * 0.1}>
              {benefit.description}
            </BenefitCard>
          ))}
        </div>
      </div>

      {/* Ценности */}
      <div ref={valuesRef} className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-24">
        <motion.h2
          className="text-3xl md:text-5xl font-inter font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ценности
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Принципы, из которых складывается каждое клиническое решение — не только какими инструментами лечим, но и
          зачем.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <BenefitCard key={value.title} icon={value.icon} title={value.title} delay={index * 0.1}>
              {value.description}
            </BenefitCard>
          ))}
        </div>
      </div>

      {/* Кому мы подходим */}
      <div ref={fitRef} className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-8 pb-24">
        <motion.h2
          className="text-3xl md:text-5xl font-inter font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isFitInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Кому мы подходим
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isFitInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Мы честны с собой в том, кому наш подход действительно полезен — это помогает не давать обещаний, которые
          не сможем сдержать.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={isFitInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-forest-400" />
              Вам подойдёт наш подход, если вы
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
              <li>Осознанно инвестируете в своё здоровье и не откладываете его «на потом»</li>
              <li>Предпочитаете долгосрочное решение проблемы компромиссу ради скорости или цены</li>
              <li>Готовы быть партнёром в лечении — приходить на контроль и соблюдать рекомендации</li>
              <li>Хотите разобраться в целостной картине, а не чинить один зуб в отрыве от остального</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={isFitInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <XCircle size={20} className="text-gray-500" />
              Скорее всего не подойдёт, если вы
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
              <li>Ищете самое дешёвое решение здесь и сейчас, без учёта последствий на годы вперёд</li>
              <li>Хотите, чтобы лечение прошло без вашего участия в дальнейшем уходе</li>
              <li>Ждёте, что «клиент всегда прав» и результат — целиком забота клиники</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-20 bg-[#002a27]">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div
            className="bg-gradient-to-br from-[#002a27]/80 to-[#003932]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-forest-500/10 filter blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 filter blur-3xl" />

            <div className="relative z-10 md:flex justify-between items-center">
              <div className="md:max-w-lg mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-arista-light mb-4">Готовы записаться?</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Запишитесь на консультацию — расскажем подробнее о клинике и подберём удобное время приёма.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <BookingButton className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-all">
                  <Calendar size={18} className="mr-2" />
                  Записаться на консультацию
                </BookingButton>

                <a
                  href="tel:+998951228855"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <Phone size={18} className="mr-2" />
                  Позвонить нам
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
