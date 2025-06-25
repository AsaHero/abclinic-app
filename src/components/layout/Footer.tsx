// src/components/layout/Footer.tsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  ChevronRight,
  ArrowUp,
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Facebook02Icon,
  FacebookIcon,
  FaceIdIcon,
  InstagramIcon,
  TelegramIcon,
} from '@hugeicons/core-free-icons';

// Premium footer section component with animation
const FooterSection = ({ title, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
    >
      <h3 className="text-lg font-inter font-medium text-white mb-6 relative inline-block">
        {title}
        <motion.div
          className="absolute -bottom-2 left-0 h-px bg-blue-500/40 w-0"
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </h3>
      {children}
    </motion.div>
  );
};

// Premium footer link component
const FooterLink = ({ to, children, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
    >
      <Link
        to={to}
        className="text-gray-400 hover:text-white transition-colors flex items-center group py-1"
      >
        <ChevronRight
          size={14}
          className="mr-2 text-blue-500/60 group-hover:text-blue-400 transition-colors"
        />
        {children}
      </Link>
    </motion.div>
  );
};

// Premium social media link component
const SocialLink = ({ href, icon, label, delay = 0 }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="bg-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 transition-colors p-3 rounded-full border border-white/10 group"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <HugeiconsIcon icon={icon} size={18} color="#ffffff" />
    </motion.a>
  );
};

// Premium contact info item
const ContactItem = ({ icon: Icon, children, delay = 0 }) => {
  return (
    <motion.div
      className="flex items-start mb-5 last:mb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mt-1 mr-3 text-blue-400">
        <Icon size={18} />
      </div>
      <div className="text-gray-300">{children}</div>
    </motion.div>
  );
};

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  // Scroll to top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer ref={footerRef} className="bg-[#171b21] text-white pt-20 pb-8 relative overflow-hidden">
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

      {/* Premium subtle gradient accents */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5 }}
        style={{ transformOrigin: 'left' }}
      />

      <motion.div
        className="absolute top-0 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"
        animate={{
          y: [0, 30, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Premium top footer section with logo and quick contact */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 pb-16 border-b border-gray-800">
          <motion.div
            className="mb-10 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Link to="/">
              <img src="/images/logo.png" alt="AB Clinic Logo" className="h-24" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ContactItem icon={Phone} delay={0.2}>
              <p className="font-medium">Телефон:</p>
              <a href="tel:+99895122-88-55" className="hover:text-white transition-colors">
                (+998) 95-122-88-55
              </a>
            </ContactItem>

            <ContactItem icon={Mail} delay={0.3}>
              <p className="font-medium">Email:</p>
              <a href="mailto:info@abclinic.uz" className="hover:text-white transition-colors">
                info@abclinic.uz
              </a>
            </ContactItem>

            <ContactItem icon={Clock} delay={0.4}>
              <p className="font-medium">Режим работы:</p>
              <p>Пн-Пт: 9:00 – 18:30</p>
              <p>Сб: 10:00 – 17:00</p>
            </ContactItem>
          </div>
        </div>

        {/* Premium main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* About Section */}
          <FooterSection title="О КЛИНИКЕ" delay={0.2}>
            <ul className="space-y-3">
              <li>
                <FooterLink to="/about" index={0}>
                  История клиники
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/news" index={1}>
                  Новости
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/team" index={2}>
                  Наши специалисты
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/reviews" index={3}>
                  Отзывы
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/gallery" index={4}>
                  Фотогалерея
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          {/* Services Section */}
          <FooterSection title="УСЛУГИ КЛИНИКИ" delay={0.3}>
            <ul className="space-y-3">
              <li>
                <FooterLink to="/services/hygiene" index={0}>
                  Гигиена и профилактика
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/services/treatment" index={1}>
                  Лечение зубов
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/services/surgery" index={2}>
                  Хирургия
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/services/orthodontics" index={3}>
                  Ортодонтия
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/services/children" index={4}>
                  Детская стоматология
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/services/prices" index={5}>
                  Прайс-лист
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          {/* For Clients Section */}
          <FooterSection title="ДЛЯ КЛИЕНТОВ" delay={0.4}>
            <ul className="space-y-3">
              <li>
                <FooterLink to="/for-clients/recommendations" index={0}>
                  Рекомендации
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/for-clients/faq" index={1}>
                  Частые вопросы
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/for-clients/discounts" index={2}>
                  Акции и скидки
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/for-clients/insurance" index={3}>
                  Страхование
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/for-clients/payments" index={4}>
                  Способы оплаты
                </FooterLink>
              </li>
            </ul>
          </FooterSection>

          {/* Contact & Social Media Section */}
          <FooterSection title="КОНТАКТЫ" delay={0.5}>
            <div className="mb-6">
              <ContactItem icon={MapPin} delay={0.6}>
                <p>Ташкент, ул. Нукусс, 88/55</p>
                <Link to="/contact" className="text-blue-400 hover:text-blue-300 mt-1 inline-block">
                  Показать на карте
                </Link>
              </ContactItem>
            </div>

            <div className="mb-8">
              <motion.p
                className="text-gray-400 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Следите за нами в социальных сетях
              </motion.p>
              <div className="flex space-x-3">
                <SocialLink
                  href="https://instagram.com/abclinic"
                  icon={InstagramIcon}
                  label="Instagram"
                  delay={0.8}
                />
                <SocialLink
                  href="https://t.me/abclinic_support"
                  icon={TelegramIcon}
                  label="Telegram"
                  delay={0.9}
                />
                <SocialLink
                  href="https://www.facebook.com/azimovclinic.uz"
                  icon={Facebook02Icon}
                  label="Facebook"
                  delay={1.0}
                />
              </div>
            </div>
          </FooterSection>
        </div>

        {/* Premium footer bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-8">
          <motion.div
            className="text-sm text-gray-500 mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>© {new Date().getFullYear()} ABClinic. Все права защищены.</p>
          </motion.div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Link to="/privacy" className="hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Link to="/terms" className="hover:text-white transition-colors">
                Пользовательское соглашение
              </Link>
            </motion.div>

            {/* Premium scroll to top button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ y: -2 }}
            >
              <ArrowUp size={14} className="mr-2" />
              <span>Наверх</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
