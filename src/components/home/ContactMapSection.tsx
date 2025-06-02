// src/components/sections/ContactMapSection.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Contact info item component with premium styling
const ContactItem = ({ icon, title, children, delay = 0 }) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      <h3 className="uppercase text-gray-500 text-sm font-medium tracking-wider mb-2">{title}</h3>
      <div className="flex items-start text-primary-900 font-medium">
        {icon}
        {children}
      </div>
    </motion.div>
  );
};

const ContactMapSection: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="w-full mx-auto bg-white relative">
      {/* Premium section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-10" />

      <div className="h-[600px] lg:h-[700px] w-full relative">
        {/* Map container with premium styling */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Google Maps iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.9393855000076!2d69.27223287910451!3d41.28842365258908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b7eac6b3353%3A0xe8351a8ecf2f6f3e!2sabclinic.uz!5e0!3m2!1sen!2sro!4v1740846993568!5m2!1sen!2sro"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"
            className="z-0"
          ></iframe>

          {/* Optional map overlay for more premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-primary-900/5 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 to-transparent pointer-events-none"></div>
        </div>

        {/* Contact info card with premium styling */}
        <motion.div
          className="absolute left-4 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 bg-white p-8 md:p-10
            rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] max-w-sm backdrop-blur-sm
            border border-gray-100"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-8">
            {/* Premium heading with subtle fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <h2 className="text-2xl font-inter font-medium text-primary-900 mb-6">
                Контактная информация
              </h2>
              <div className="h-px w-20 bg-blue-500/30 mb-8"></div>
            </motion.div>

            {/* Schedule info with premium animation */}
            <ContactItem
              icon={<Clock size={18} className="mr-3 mt-0.5 text-blue-500" />}
              title="Режим работы"
              delay={0.2}
            >
              <div>
                <div className="flex justify-between items-center gap-6 mb-1">
                  <span className="text-gray-600">Понедельник - Пятница</span>
                  <span className="font-medium">9:00 – 18:30</span>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-gray-600">Суббота</span>
                  <span className="font-medium">10:00 – 17:00</span>
                </div>
              </div>
            </ContactItem>

            {/* Phone info with premium animation */}
            <ContactItem
              icon={<Phone size={18} className="mr-3 mt-0.5 text-blue-500" />}
              title="Телефон"
              delay={0.4}
            >
              <a
                href="tel:+99895122-88-55"
                className="group flex flex-col hover:text-blue-600 transition-colors"
              >
                <span>(+998) 95-122-88-55</span>
                <span className="text-sm text-gray-500 group-hover:text-blue-400 flex items-center mt-1">
                  Позвонить сейчас
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                  >
                    <ArrowRight size={14} className="ml-1.5" />
                  </motion.div>
                </span>
              </a>
            </ContactItem>

            {/* Email info - new premium addition */}
            <ContactItem
              icon={<Mail size={18} className="mr-3 mt-0.5 text-blue-500" />}
              title="Почта"
              delay={0.6}
            >
              <a href="mailto:info@abclinic.uz" className="hover:text-blue-600 transition-colors">
                info@abclinic.uz
              </a>
            </ContactItem>

            {/* Address info with premium animation */}
            <ContactItem
              icon={<MapPin size={18} className="mr-3 mt-0.5 text-blue-500" />}
              title="Адрес"
              delay={0.8}
            >
              <div className="flex flex-col">
                <span>Ташкент, ул. Нукусс, 88/55</span>
                <Link
                  to="/contact"
                  className="text-sm text-blue-500 flex items-center mt-2 hover:text-blue-600"
                >
                  Подробнее
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </div>
            </ContactItem>
          </div>
        </motion.div>

        {/* Premium decorative element */}
        <motion.div
          className="absolute -bottom-6 right-[10%] w-12 h-12 bg-blue-500 rounded-full opacity-0"
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0.8, 1.5, 0.8],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{ filter: 'blur(20px)' }}
        />
      </div>

      {/* Premium flourish bottom border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </section>
  );
};

export default ContactMapSection;
