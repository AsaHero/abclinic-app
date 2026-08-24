"use client";

// src/components/home/ContactMapSection.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";
import BookingButton from "@/components/common/BookingButton";

const ContactMapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="w-full bg-primary-900 py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-inter text-3xl leading-tight font-bold text-white md:text-4xl">
            Разберём ваш случай на консультации
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-400">
            Фотопротокол, честный план и стоимость — до начала любого лечения.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <BookingButton
              glass
              className="w-fit rounded-full px-7 py-4 text-sm font-medium text-white hover:scale-[1.03]"
            >
              <span>Разобрать случай</span>
            </BookingButton>
            <a
              href="tel:+99895122-88-55"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10"
            >
              <Phone size={16} />
              +998 95 122-88-55
            </a>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="shrink-0 text-white/40" />
              Ташкент, ул. Нукус, 88
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="shrink-0 text-white/40" />
              Пн–Сб, 09:00–18:00
            </div>
          </div>
        </motion.div>

        <motion.div
          className="h-[380px] w-full overflow-hidden rounded-3xl border border-white/10 md:h-[440px]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <iframe
            src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=9426831655"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMapSection;
