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
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12 pb-12 border-b border-gray-800">
          {/* Column 1: Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Link to="/" className="inline-block mb-6">
              <img src="/images/logo.png" alt="AB Clinic Logo" className="h-24" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Профессиональная медицинская помощь с заботой о вашем здоровье
            </p>
          </motion.div>

          {/* Column 2: Contact Information */}
          <div>
            <FooterSection title="Контакты" delay={0.1}>
              <div className="space-y-4">
                <ContactItem icon={Phone} delay={0.2}>
                  <p className="text-sm font-medium text-gray-400 mb-1">Телефон:</p>
                  <a href="tel:+99895122-88-55" className="hover:text-white transition-colors">
                    (+998) 95-122-88-55
                  </a>
                </ContactItem>

                <ContactItem icon={Mail} delay={0.3}>
                  <p className="text-sm font-medium text-gray-400 mb-1">Email:</p>
                  <a
                    href="mailto:abclinic.uz@gmail.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    abclinic.uz@gmail.com
                  </a>
                </ContactItem>

                <ContactItem icon={Clock} delay={0.4}>
                  <p className="text-sm font-medium text-gray-400 mb-1">Режим работы:</p>
                  <p>Пн-Cб: 9:00 – 18:00</p>
                </ContactItem>

                <ContactItem icon={MapPin} delay={0.5}>
                  <p className="text-sm font-medium text-gray-400 mb-1">Адрес:</p>
                  <p className="mb-1">Ташкент, ул. Нукусс, 88/55</p>
                  <a
                    href="https://maps.app.goo.gl/zWmNZtq1TCcv8hG67"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm inline-block"
                  >
                    Показать на карте →
                  </a>
                </ContactItem>
              </div>
            </FooterSection>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <FooterSection title="Мы в социальных сетях" delay={0.2}>
              <motion.p
                className="text-gray-400 text-sm mb-6 leading-relaxed"
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
            </FooterSection>
          </div>
        </div>

        {/* Bottom section: Copyright and Legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            className="text-sm text-gray-500 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>© {new Date().getFullYear()} ABClinic. Все права защищены.</p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
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

            {/* Scroll to top button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ y: -2 }}
              aria-label="Scroll to top"
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
