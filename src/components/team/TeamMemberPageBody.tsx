"use client";

// src/components/team/TeamMemberPageBody.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, GraduationCap, User, Expand, X } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { isDoctor } from "@/types/team";
import BookingButton from "@/components/common/BookingButton";

interface TeamMemberPageBodyProps {
  member: TeamMember;
}

const TeamMemberPageBody: React.FC<TeamMemberPageBodyProps> = ({ member }) => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fullName = `${member.firstName} ${member.lastName}`;
  const education = member.education ?? [];
  const certificates = member.certificates ?? [];

  return (
    <div className="min-h-screen pt-33 bg-[#001d1c] text-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mb-8">
        <div className="flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/team" className="hover:text-white transition-colors">
            Команда
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{fullName}</span>
        </div>
      </div>

      {/* Hero */}
      <motion.section
        className="py-12 bg-gradient-to-r from-[#00463C]/0 to-[#006A59]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <Link
            href="/team"
            className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 mb-12 group"
          >
            <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wider">Вернуться к команде</span>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <motion.div
              className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#002a27] to-[#003932] flex-shrink-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {member.photo ? (
                <img src={member.photo} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={56} className="text-gray-600" />
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl font-arista-light mb-3 leading-tight">{fullName}</h1>
              <div className="inline-flex items-center px-3 py-2 rounded-lg bg-forest-500/20 text-forest-400 text-sm">
                {member.roleTitle || member.role}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Details */}
      <section className="py-24 bg-gradient-to-b from-[#001d1c] to-[#002a27]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl space-y-16">
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center mb-8">
                <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                <h2 className="text-3xl font-arista-light mx-6">О специалисте</h2>
                <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
              </div>

              {member.bio ? (
                <p className="text-xl leading-relaxed text-gray-300 font-light whitespace-pre-line">{member.bio}</p>
              ) : (
                <p className="text-lg leading-relaxed text-gray-500 font-light italic">
                  Скоро добавим подробную информацию о специалисте.
                </p>
              )}
            </motion.div>

            {/* Education */}
            {education.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Образование и сертификаты</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
                </div>
                <ul className="space-y-4">
                  {education.map((item, i) => (
                    <li key={i} className="flex items-start bg-white/5 backdrop-blur-sm rounded-xl p-5 hover:bg-white/8 transition-colors">
                      <GraduationCap size={20} className="text-forest-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300 text-lg font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Certificates gallery */}
            {certificates.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center mb-8">
                  <div className="h-px flex-grow bg-gradient-to-r from-forest-500/50 to-transparent"></div>
                  <h2 className="text-3xl font-arista-light mx-6">Сертификаты и дипломы</h2>
                  <div className="h-px flex-grow bg-gradient-to-l from-forest-500/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {certificates.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightbox(src)}
                      className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 group"
                    >
                      <img
                        src={src}
                        alt={`Сертификат ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Expand size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox} alt="Сертификат" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
              <button
                onClick={() => setLightbox(null)}
                aria-label="Закрыть сертификат"
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
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
                <h2 className="text-3xl md:text-4xl font-arista-light mb-4">Не нашли нужного специалиста?</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Посмотрите остальных врачей и сотрудников клиники или запишитесь на консультацию, и мы подберём
                  {isDoctor(member) ? " подходящего специалиста" : " удобное время"}.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <BookingButton className="bg-gradient-to-r from-forest-500 to-forest-400 hover:from-forest-600 hover:to-forest-500 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-all">
                  Записаться на прием
                </BookingButton>
                <Link
                  href="/team"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  Вся команда
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TeamMemberPageBody;
