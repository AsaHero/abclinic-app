import { Calendar, Info, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactWithUs: React.FC<{
  title: string;
  description: string;
  needsConsultation: boolean;
  setIsHowItWorksModalOpen: (isOpen: boolean) => void;
}> = ({ title, description, needsConsultation, setIsHowItWorksModalOpen }) => {
  return (
    <section className="py-24 relative">
      {/* Gradient background with luxury pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1e24] to-[#131719]"></div>
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'url(/assets/pattern.svg)' }}
      ></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute top-24 right-24 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute bottom-24 left-24 w-40 h-40 rounded-full bg-teal-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <motion.div
          className="bg-gradient-to-br from-[#1e2329]/80 to-[#252a32]/80 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/5 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Top accent line */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>

          <div className="p-12 md:p-16">
            <div className="max-w-4xl mx-auto text-center">
              {needsConsultation ? (
                <>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-arista-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    {title}
                  </h2>
                  <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light">
                    {description}
                  </p>
                  <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <Link
                      to="/services/consult-diagnostic"
                      className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-500/20 group"
                    >
                      <Calendar
                        size={20}
                        className="mr-4 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-lg">Записаться на консультацию</span>
                    </Link>
                    <button
                      onClick={() => setIsHowItWorksModalOpen(true)}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 group"
                    >
                      <Info size={20} className="mr-4 group-hover:scale-110 transition-transform" />
                      <span className="text-lg">Как проходит лечение</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-arista-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    {title}
                  </h2>
                  <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light">
                    {description}
                  </p>
                  <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <Link
                      to="/contact"
                      className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-500/20 group"
                    >
                      <Calendar
                        size={20}
                        className="mr-4 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-lg">Записаться на прием</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium px-10 py-5 rounded-xl inline-flex items-center justify-center transition-all duration-300 group"
                    >
                      <Phone
                        size={20}
                        className="mr-4 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-lg">Позвонить нам</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactWithUs;
