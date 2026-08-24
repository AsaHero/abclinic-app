"use client";

// src/components/team/TeamPageBody.tsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react";
import type { TeamMember } from "@/types/team";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function initials(member: TeamMember) {
  return `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""}`.toUpperCase();
}

const MemberAvatar: React.FC<{ member: TeamMember }> = ({ member }) => {
  if (member.photo) {
    return (
      <div className="aspect-square w-full overflow-hidden bg-gray-800">
        <img
          src={member.photo}
          alt={`${member.firstName} ${member.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-[#002a27] to-[#003932]">
      {initials(member) ? (
        <span className="text-4xl font-arista-light text-gray-500">{initials(member)}</span>
      ) : (
        <User size={48} className="text-gray-600" />
      )}
    </div>
  );
};

interface TeamPageBodyProps {
  members: TeamMember[];
}

const TeamPageBody: React.FC<TeamPageBodyProps> = ({ members }) => {
  return (
    <div className="min-h-screen bg-[#001d1c] text-white">
      {/* Hero */}
      <section className="relative pt-47 pb-15 bg-gradient-to-b from-[#002a27] to-[#001d1c]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <motion.h1
            className="text-5xl md:text-7xl font-arista-light mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Команда
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Специалисты клиники abclinic.uz
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {members.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Информация о команде скоро появится.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {members.map((member) => (
                <motion.div key={member.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Link
                    href={`/team/${member.id}`}
                    className="block bg-[#002a27] rounded-lg overflow-hidden hover:bg-[#003932] transition-colors duration-300"
                  >
                    <MemberAvatar member={member} />
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-white">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{member.roleTitle || member.role}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPageBody;
