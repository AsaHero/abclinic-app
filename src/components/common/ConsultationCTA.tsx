"use client";

import { Calendar, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Shared by PriceListPageBody and ComplexTreatmentPageBody — same card,
// only the heading/body copy differs per page. Distinct from ContactWithUs
// (different padding, decorative-blur placement, and button sizing), so
// kept as its own component rather than merged into that one.
const ConsultationCTA: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <section className="py-20 bg-[#002a27]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          className="bg-gradient-to-br from-[#002a27]/80 to-[#003932]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-forest-500/10 filter blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 filter blur-3xl"></div>

          <div className="relative z-10 md:flex justify-between items-center">
            <div className="md:max-w-lg mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-arista-light mb-4">{title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-col space-y-4">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-all"
              >
                <Calendar size={18} className="mr-2" />
                Записаться на консультацию
              </Link>

              <Link
                href="/contact"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Phone size={18} className="mr-2" />
                Позвонить нам
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
