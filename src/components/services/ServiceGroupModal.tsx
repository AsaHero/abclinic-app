"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { X, Check, Layers, Cpu, Sparkles, ShieldCheck, AlignCenter, Palette, Anchor, Sun, Scissors, MessageCircle } from "lucide-react";
import type { ServiceGroup } from "@/types/serviceData";

// Distinguishing icon per material tier — only накладки have per-service
// icons (the choice IS the material). Other groups fall back to their
// group-level icon below, so a whitening card doesn't render a random
// ceramic-tier icon.
const TIER_ICONS: Record<string, React.ElementType> = {
  "restoration-indirect-hybrid": Layers,
  "restoration-indirect-e-max": Cpu,
  "restoration-indirect-polymer": Sparkles,
};

// Mirrors ProblemGroupGrid's GROUP_ICONS — used as the per-card fallback
// icon for groups that don't have material-specific icons of their own.
const GROUP_FALLBACK_ICONS: Record<string, React.ElementType> = {
  "problem-clean-teeth": Sparkles,
  "problem-treat-caries": ShieldCheck,
  "indirect-restoration-material": Layers,
  "problem-align-teeth": AlignCenter,
  "problem-change-shape-color": Palette,
  "problem-replace-missing-tooth": Anchor,
  whitening: Sun,
  extraction: Scissors,
  "consultation-group": MessageCircle,
};

interface ServiceGroupModalProps {
  group: ServiceGroup | null;
  onClose: () => void;
}

// Rendered via createPortal to document.body: (public)/layout.tsx gives
// <main> position:relative z-10 for the sticky-footer-reveal trick, which
// caps every in-main element below the header's z-50 regardless of its own
// z-index. Portaling out of <main> is the established fix (see
// BeforeAfterSection / ValueShiftSection) — without it the close button
// renders visually on top but the header intercepts the click.
const ServiceGroupModal: React.FC<ServiceGroupModalProps> = ({ group, onClose }) => {
  useEffect(() => {
    if (!group) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [group, onClose]);

  if (!group || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        className="bg-[#001d1c] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="sticky top-0 bg-[#001d1c] border-b border-white/10 p-6 md:p-8 pb-6 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-arista-light text-white mb-2">{group.title}</h2>
              {group.tagline && <p className="text-gray-400 text-sm md:text-base max-w-2xl">{group.tagline}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 pt-6">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${
              group.services.length === 1 ? "max-w-sm mx-auto" : ""
            }`}
          >
            {group.services.map((service) => {
              const Icon = TIER_ICONS[service.id] ?? GROUP_FALLBACK_ICONS[group.id] ?? Layers;
              const isRecommended = service.id === group.recommendedServiceId;
              return (
                <div
                  key={service.id}
                  className={`rounded-xl border p-6 flex flex-col ${
                    isRecommended ? "border-forest-400/60 bg-[#002a27]" : "border-white/10 bg-[#002119]"
                  }`}
                >
                  {isRecommended && (
                    <span className="self-start mb-3 text-xs px-3 py-1 rounded-full bg-forest-500/20 text-forest-300 border border-forest-400/30">
                      Рекомендуем
                    </span>
                  )}
                  <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-forest-300 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <div className="text-2xl font-light text-white mb-5">{service.price.toLocaleString("ru-RU")} сум</div>

                  <Link
                    href={`/services/${service.id}`}
                    onClick={onClose}
                    className="mb-6 text-center bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-lg transition-colors"
                  >
                    Подробнее
                  </Link>

                  {service.benefits && service.benefits.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Что входит</p>
                      <ul className="space-y-2.5">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Check className="w-4 h-4 text-forest-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-gray-500 text-sm text-center mt-8">
            Что из этого подойдёт именно вам — точно определяется на консультации, а не по описанию на сайте.
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default ServiceGroupModal;
