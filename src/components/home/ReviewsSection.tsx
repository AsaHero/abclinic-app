"use client";

// src/components/home/ReviewsSection.tsx
//
// Real patient reviews — verbatim quotes pulled from the clinic's public
// Yandex Maps / Google Maps / 2GIS listings (read and archived in the wiki
// 2026-08-21/22: business/ab-clinic-overview.md, sources/ab-clinic-yandex-
// reviews-2026-08.md, sources/ab-clinic-google-2gis-reviews-2026-08.md).
// Trimmed for length where noted, never reworded — these are real people's
// words about real visits, not generated testimonials.
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import Carousel from "@/components/home/Carousel";

interface Review {
  name: string;
  date: string;
  source: string;
  text: string;
}

// Owner's explicit filter (2026-08-22): drop reviews naming staff who are
// no longer relevant/current (Мансур Анварович, Виктория Вадимовна, Ким
// Татьяна Юрьевна) — keep only reviews about the current team or the
// clinic generally, so nothing on the homepage points at someone who's
// no longer part of the picture.
const REVIEWS: Review[] = [
  {
    name: "Jahongir Umidjonov",
    date: "2023",
    source: "2ГИС",
    text: "Хорошие врачи — мне в 4 клиниках говорили удалить зубы, но в этой мне их сохранили. Спасибо вам.",
  },
  {
    name: "Anna Koval",
    date: "2023",
    source: "Google",
    text: "Исходя из моего опыта — а опыт лечения зубов у меня в трёх разных странах и с разными специалистами — это отличная клиника. Весь персонал вежливый, клиника чистая, современное оборудование.",
  },
  {
    name: "Анжела Лим",
    date: "сентябрь 2024",
    source: "2ГИС",
    text: "Летом была в Ташкенте и попала в такие хорошие и заботливые руки! За ограниченное время (месяц!) мне вылечили зубы, поставили виниры и сделали накладки! Спасибо огромное за ваш труд, персонал и врачи.",
  },
  {
    name: "Семейство Романович",
    date: "апрель 2023",
    source: "2ГИС",
    text: "Почти с самого открытия лечим свои зубы и зубы наших детей именно в этой клинике. Очень довольны результатом и отношением персонала, всегда отвечают на любые вопросы с трепетом и пониманием.",
  },
  {
    name: "Shahrizoda Turanova",
    date: "июль 2023",
    source: "2ГИС",
    text: "Очень чистая и уютная клиника, нет ощущения стомклиники, что помогает преодолевать страх. Администраторы, ассистенты и врачи очень внимательные и профессионалы своего дела.",
  },
  {
    name: "Doniyorbek Sodiqov",
    date: "апрель 2025",
    source: "2ГИС",
    text: "Атмосфера такая, что не чувствуешь себя у стоматолога — очень уютно. Сделали сканер зуба, а не слепки, как раньше. Администрация звонит и предупреждает заранее.",
  },
];

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex h-full min-h-[240px] flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-6">
    <div>
      <Quote size={22} className="mb-4 text-forest-400" />
      <p className="text-sm leading-relaxed text-gray-300">{review.text}</p>
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
      <span className="text-sm font-medium text-white">{review.name}</span>
      <span className="text-xs text-gray-500">
        {review.source} · {review.date}
      </span>
    </div>
  </div>
);

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="w-full bg-primary-900 py-20 md:py-24">
      <div ref={ref} className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.p
          className="mb-3 text-xs font-semibold tracking-[0.15em] text-forest-400 uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Отзывы
        </motion.p>
        <motion.h2
          className="mb-2 font-inter text-2xl font-bold text-white md:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Что говорят пациенты
        </motion.h2>
        <motion.p
          className="mb-10 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Реальные отзывы с Яндекс.Карт, Google Maps и 2ГИС — 5.0 / 4.9 / 4.9
          из 114 / 92 / 48 оценок
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel slides={REVIEWS.map((r) => <ReviewCard key={r.name} review={r} />)} />
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
