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
            src="https://yandex.ru/map-widget/v1/?z=12&ol=biz&oid=9426831655"
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
