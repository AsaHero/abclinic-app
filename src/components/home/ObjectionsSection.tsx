"use client";

// src/components/home/ObjectionsSection.tsx
//
// Warm-step objection handling — the 4 most homepage-relevant of the
// "fifteen questions" a patient actually has before booking (per
// business/ab-clinic-mentor-playbook.md, "Инструмент 1"). Not a FAQ dump —
// just enough to remove the reasons visitors say "I'll think about it".
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface QA {
  q: string;
  a: string;
}

const items: QA[] = [
  {
    q: "Сколько это будет стоить?",
    a: "Одна смета на весь план лечения — вы видите её до начала, без сюрпризов на середине.",
  },
  {
    q: "Как понять, что не разведут на лишнее?",
    a: "Каждый этап фиксируется фотопротоколом — вы видите, что именно сделано и зачем.",
  },
  {
    q: "Что если отложить лечение?",
    a: "Зуб — невосполнимый ресурс. Чем раньше вмешательство, тем больше своей ткани удаётся сохранить.",
  },
  {
    q: "Кто именно будет лечить?",
    a: "Консультация и сама реставрация накладками — это я лично. Если нужна подготовка (гигиена, лечение кариеса), эти этапы — с командой под моим контролем.",
  },
  {
    q: "Не хочу срезать здоровый зуб ради красоты",
    a: "Сначала оцениваем, что действительно можно сохранить, и только потом предлагаем план — не обтачиваем то, что можно оставить.",
  },
  {
    q: "Не станут ли зубы неестественно белыми?",
    a: "Работаем на естественный результат — форма и цвет подбираются под ваше лицо, а не «под стандарт».",
  },
  {
    q: "Почему нужно платить заранее?",
    a: "Материал для накладки заказывается под ваш конкретный зуб — депозит бронирует не только время в расписании, но и материал, который нельзя переиспользовать для другого пациента.",
  },
];

const QACard = ({ q, a, delay }: QA & { delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="mb-2.5 text-base font-medium text-white">{q}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{a}</p>
    </motion.div>
  );
};

const ObjectionsSection = (): ReactNode => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.4 });

  return (
    <section className="w-full bg-[#002a27] py-20 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8 lg:px-12">
        <motion.h2
          ref={headingRef}
          className="font-inter text-2xl md:text-3xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          То, что обычно спрашивают до записи
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <QACard key={item.q} {...item} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectionsSection;
