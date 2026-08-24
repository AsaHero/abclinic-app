"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Layers,
  AlignCenter,
  Palette,
  Anchor,
  HelpCircle,
  ChevronRight,
  ArrowDown,
  Sun,
  Scissors,
  MessageCircle,
} from "lucide-react";
import type { ServiceGroup } from "@/types/serviceData";

const GROUP_ICONS: Record<string, React.ElementType> = {
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

const RESTORATION_GROUP_ID = "indirect-restoration-material";
const HYGIENE_GROUP_ID = "problem-clean-teeth";
const SAVE_THE_TOOTH_SERVICE_ID = "save-the-tooth-consultation";
// Консультация isn't a "problem" a patient arrives with — it's an entry
// mechanism, already reachable via its own flows elsewhere — so it's left
// out of this "what brought you in" pill row even though it's a normal
// serviceGroup like the others (it still collapses correctly in the flat
// price list below, which is the thing that actually needed it).
const EXCLUDED_FROM_OTHER = new Set(["consultation-group"]);
// The actual накладки material tiers within the (now broader) "Коронки"
// group — used to keep the flagship card's price honest to the premium
// choice rather than the group's cheapest member overall.
const TIER_ICON_IDS: Record<string, true> = {
  "restoration-indirect-hybrid": true,
  "restoration-indirect-e-max": true,
  "restoration-indirect-polymer": true,
};

interface ProblemGroupGridProps {
  groups: ServiceGroup[];
  onOpenGroup: (group: ServiceGroup) => void;
}

// The two services the clinic actually wants to sell are гигиена and
// накладки — everything else (кариес, элайнеры, форма/цвет, имплантация)
// is a supporting service that gets discovered during those two visits,
// not something marketed on its own. So this is deliberately NOT a grid of
// equal tiles anymore: hygiene is the fast, cheap, no-friction entry point
// (direct link to the flagship service, no comparison modal in the way);
// накладки is the premium destination, entered through the diagnostic
// consultation rather than a cold pick-a-material choice; the remaining
// groups are demoted to a slim link row underneath.
const ProblemGroupGrid: React.FC<ProblemGroupGridProps> = ({ groups, onOpenGroup }) => {
  if (groups.length === 0) return null;

  const hygieneGroup = groups.find((g) => g.id === HYGIENE_GROUP_ID);
  const restorationGroup = groups.find((g) => g.id === RESTORATION_GROUP_ID);
  const otherGroups = groups.filter(
    (g) => g.id !== HYGIENE_GROUP_ID && g.id !== RESTORATION_GROUP_ID && !EXCLUDED_FROM_OTHER.has(g.id)
  );

  const hygieneFlagshipId = hygieneGroup?.recommendedServiceId;
  const hygieneFlagship = hygieneGroup?.services.find((s) => s.id === hygieneFlagshipId);
  // "Коронки" (same group, RESTORATION_GROUP_ID) now also covers the flat
  // price list's temporary/edge-case crown items for browsing purposes —
  // but the flagship card's "от X" should still read as the premium накладки
  // choice, not get dragged down by a 900k temporary PMMA crown.
  const restorationMinPrice = restorationGroup
    ? Math.min(...restorationGroup.services.filter((s) => s.id in TIER_ICON_IDS).map((s) => s.price))
    : null;

  // The flat price-list "Коронки" browsing card wants the whole group
  // (temp crown through edge-case severely-damaged-tooth), but the funnel's
  // premium "Сравнить материалы" button must not — showing a 900k temporary
  // PMMA crown and an unrelated edge-case service next to накладки options
  // undercuts the premium positioning this card exists to build. Build a
  // narrowed clone with just the 3 real material tiers for that button.
  const restorationTiersGroup: ServiceGroup | null = restorationGroup
    ? {
        ...restorationGroup,
        title: "Накладки: выбор материала",
        tagline: "Один и тот же принцип — сохранить свой зуб — с разным материалом и ценой. Что подойдёт, решается на диагностике.",
        services: restorationGroup.services.filter((s) => s.id in TIER_ICON_IDS),
      }
    : null;

  return (
    <section className="mb-14">
      <h2 className="text-2xl md:text-3xl font-arista-light text-white mb-2">С какой задачей вы к нам?</h2>
      <p className="text-gray-400 mb-6">Выберите то, что ближе всего к вашей ситуации — дальше разберёмся вместе.</p>

      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_auto_1.2fr] gap-4 items-stretch">
        {/* Гигиена — the fast, low-friction entry. One flagship service, one
            price, one button; no material comparison to slow it down. */}
        {hygieneGroup && (
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-[#002a27] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors duration-300 flex flex-col"
          >
            <Link href={hygieneFlagship ? `/services/${hygieneFlagship.id}` : "#"} className="p-6 flex flex-col h-full">
              <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-forest-300 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1.5">Гигиена</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">
                Быстро, недорого, без долгих раздумий — хороший повод показать зубы врачу.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-white font-medium">
                  {hygieneFlagship ? `${hygieneFlagship.price.toLocaleString("ru-RU")} сум` : "Узнать цену"}
                </span>
                <span className="text-sm text-forest-400 flex items-center">
                  Записаться <ChevronRight size={16} className="ml-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Connector — makes the actual funnel mechanism explicit: the
            hygiene visit is also a diagnostic touchpoint for накладки. */}
        <div className="hidden md:flex flex-col items-center justify-center px-2 text-center">
          <ArrowDown className="text-gray-600 rotate-[-90deg]" size={20} />
          <p className="text-[11px] text-gray-500 mt-2 max-w-[110px] leading-snug">
            на гигиене врач заодно проверит, нет ли разрушений
          </p>
        </div>

        {/* Накладки — the premium destination. Entered through the
            diagnostic consultation (the real converter), not a cold
            three-material comparison — that choice only makes sense after
            a doctor has actually looked at the tooth. */}
        {restorationGroup && (
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-[#002a27] to-[#003932] border border-forest-400/30 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-7 flex flex-col h-full">
              <div className="w-11 h-11 rounded-lg bg-forest-500/15 flex items-center justify-center text-forest-300 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-medium text-white mb-1.5">Накладки — без коронок и имплантов</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">
                Восстановление разрушенного зуба биомиметическими накладками — там, где ещё можно сохранить свой зуб.
                Материал и объём работы определяются на консультации.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-white/10">
                <span className="text-white font-medium">
                  {restorationMinPrice ? `от ${restorationMinPrice.toLocaleString("ru-RU")} сум` : ""}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => restorationTiersGroup && onOpenGroup(restorationTiersGroup)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Сравнить материалы
                  </button>
                  <Link
                    href={`/services/${SAVE_THE_TOOTH_SERVICE_ID}`}
                    className="inline-flex items-center rounded-full bg-forest-500 hover:bg-forest-600 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Записаться на консультацию
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Everything else — real services, but supporting ones: discovered
          during the two visits above, not marketed as their own draw. */}
      {otherGroups.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-1">Другие услуги:</span>
          {otherGroups.map((group) => {
            const Icon = GROUP_ICONS[group.id] ?? Sparkles;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onOpenGroup(group)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <Icon size={13} />
                {group.title}
              </button>
            );
          })}
        </div>
      )}

      <Link
        href="/services/consult-general"
        className="mt-4 flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-colors group"
      >
        <span className="flex items-center text-gray-300">
          <HelpCircle size={18} className="mr-3 text-forest-300 flex-shrink-0" />
          Не уверены, с чего начать? Разберём на консультации.
        </span>
        <ChevronRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </Link>
    </section>
  );
};

export default ProblemGroupGrid;
