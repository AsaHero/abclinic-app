"use client";

import { type ReactNode } from "react";
import { BOOKING_URL } from "@/lib/booking";
import { GlassLayers, glassBoxShadow, glassTransitionTiming } from "@/components/ui/liquid-glass";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function BookingButton({
  className,
  children,
  glass = false,
}: {
  className?: string;
  children: ReactNode;
  /** Apply the liquid-glass frosted look — best over a photo/gradient background. */
  glass?: boolean;
}) {
  const handleClick = () => {
    window.ym?.(105088457, "reachGoal", "booking_click");
    window.gtag?.("event", "booking_click", { page: window.location.pathname });
  };

  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        glass
          ? `relative inline-flex items-center overflow-hidden cursor-pointer transition-all duration-700 ${className ?? ""}`
          : className
      }
      style={
        glass ? { boxShadow: glassBoxShadow, transitionTimingFunction: glassTransitionTiming } : undefined
      }
      onClick={handleClick}
    >
      {glass ? (
        <>
          <GlassLayers />
          <span className="relative z-30 flex items-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </a>
  );
}
