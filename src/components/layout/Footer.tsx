"use client";

// src/components/layout/Footer.tsx
//
// "Cinematic" scroll-reveal footer — adapted from a GSAP/shadcn reference
// the owner liked. Re-themed from scratch rather than copy-pasted: the
// reference used generic shadcn light-mode tokens (--background/--foreground
// etc., which resolve to white/black here since this app never toggles a
// .dark class) and Google-Fonts Plus Jakarta Sans, both of which would have
// clashed with the site's actual forest palette and Arista/Inter type. Real
// clinic content (phone/address/hours/socials) is kept — the original demo
// only had app-store buttons and placeholder copy.
import * as React from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Clock, ArrowUp, ArrowRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Facebook02Icon, InstagramIcon, TelegramIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/cn";
import { BOOKING_URL } from "@/lib/booking";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// Theme — mapped to this site's real tokens (forest palette / white text),
// not the generic shadcn ones the reference component shipped with.
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer {
  --pill-bg-1: rgba(255,255,255,0.05);
  --pill-bg-2: rgba(255,255,255,0.02);
  --pill-border: rgba(255,255,255,0.1);
  --pill-border-hover: rgba(255,255,255,0.22);
  --pill-highlight: rgba(255,255,255,0.12);
  --pill-highlight-hover: rgba(255,255,255,0.22);
  --pill-shadow: rgba(0,0,0,0.45);
  --pill-shadow-hover: rgba(0,0,0,0.55);
  --pill-inset-shadow: rgba(0,0,0,0.7);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.85; }
}
@keyframes footer-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.22); }
  30% { transform: scale(1); }
}
.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-marquee { animation: footer-marquee 38s linear infinite; }
.animate-footer-heartbeat { animation: footer-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; }

.footer-bg-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.footer-aurora {
  background: radial-gradient(circle at 50% 50%, var(--color-forest-500) 0%, var(--color-forest-700) 45%, transparent 72%);
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 0 10px 30px -10px var(--pill-shadow), inset 0 1px 1px var(--pill-highlight), inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.footer-glass-pill:hover {
  border-color: var(--pill-border-hover);
  box-shadow: 0 20px 40px -10px var(--pill-shadow-hover), inset 0 1px 1px var(--pill-highlight-hover);
}

.footer-giant-bg-text {
  font-size: 15vw;
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.05);
  background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 24px rgba(255,255,255,0.12));
}
`;

// -------------------------------------------------------------------------
// Magnetic button primitive (zero dependency beyond gsap, kept from the
// reference — generic UI candy, no site-specific coupling needed).
// -------------------------------------------------------------------------
type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.RefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.RefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// Content — real clinic value props, not the reference's placeholder copy.
// -------------------------------------------------------------------------
const MARQUEE_ITEMS = [
  "Восстановление накладками",
  "Биомиметическая стоматология",
  "Фотопротокол на каждом этапе",
  "Реставрацию веду лично",
  "Сохраняем ваш зуб",
];

const MarqueeRow = () => (
  <div className="flex items-center space-x-10 px-5">
    {MARQUEE_ITEMS.map((item, i) => (
      <React.Fragment key={item}>
        <span>{item}</span>
        <span className={i % 2 === 0 ? "text-forest-400/60" : "text-forest-200/50"}>✦</span>
      </React.Fragment>
    ))}
  </div>
);

const socialLinks = [
  { href: "https://instagram.com/abclinic", icon: InstagramIcon, label: "Instagram" },
  { href: "https://t.me/abclinic_support", icon: TelegramIcon, label: "Telegram" },
  { href: "https://www.facebook.com/azimovclinic.uz", icon: Facebook02Icon, label: "Facebook" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "8vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        [headingRef.current, ctaRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 70%",
            end: "top top",
            scrub: 1,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Layouts persist across client-side navigation in the App Router, so this
  // component doesn't remount between pages — ScrollTrigger's cached
  // measurements can go stale when a shorter/taller page swaps in under it.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const handleBookingClick = () => {
    window.ym?.(105088457, "reachGoal", "booking_click");
    window.gtag?.("event", "booking_click", { page: window.location.pathname });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Sticky reveal: paired with the negative margin-bottom on <main> in
          (public)/layout.tsx — main visually overlaps this footer's full
          height, so it only becomes visible once main has scrolled out
          from on top of it, rather than being pinned for the whole page
          (the fixed+clip-path version of this effect doesn't actually
          contain a fixed child without a transform on the ancestor, so it
          rendered on top of every section — verified and fixed here). */}
      <footer
        ref={footerRef}
        className="cinematic-footer sticky bottom-0 z-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-primary-900 text-white"
      >
        {/* Ambient glow + grid */}
          <div className="footer-aurora animate-footer-breathe pointer-events-none absolute top-1/2 left-1/2 z-0 h-[55vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant watermark */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[4vh] left-1/2 z-0 -translate-x-1/2 font-arista-bold whitespace-nowrap select-none"
          >
            ABCLINIC
          </div>

          {/* Marquee strip */}
          <div className="absolute top-10 left-0 z-10 w-full -rotate-1 scale-105 overflow-hidden border-y border-white/10 bg-primary-900/70 py-3.5 shadow-2xl backdrop-blur-md md:top-14">
            <div className="animate-footer-marquee flex w-max text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase md:text-xs">
              <MarqueeRow />
              <MarqueeRow />
            </div>
          </div>

          {/* Center — heading + primary CTAs */}
          <div className="relative z-10 mx-auto mt-24 flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 md:mt-28">
            <h2
              ref={headingRef}
              className="footer-text-glow mb-8 text-center font-arista-bold text-4xl uppercase md:text-6xl lg:text-7xl"
            >
              Готовы разобрать
              <br />
              ваш случай?
            </h2>

            <div ref={ctaRef} className="flex w-full flex-col items-center gap-5">
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBookingClick}
                  className="footer-glass-pill group flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white md:text-base"
                >
                  Записаться на консультацию
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="tel:+99895122-88-55"
                  className="footer-glass-pill flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white md:text-base"
                >
                  <Phone size={16} className="text-forest-400" />
                  +998 95 122-88-55
                </MagneticButton>
              </div>

              {/* Compact contact strip */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-400 md:text-sm">
                <span className="flex items-center gap-2">
                  <Mail size={14} className="text-forest-400" />
                  abclinic.uz@gmail.com
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-forest-400" />
                  Пн-Сб: 9:00 – 18:00
                </span>
                <a
                  href="https://maps.app.goo.gl/zWmNZtq1TCcv8hG67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <MapPin size={14} className="text-forest-400" />
                  Ташкент, ул. Нукус, 88/55
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
            <div className="order-2 text-center text-[10px] font-semibold tracking-widest text-gray-500 uppercase md:order-1 md:text-left md:text-xs">
              © {new Date().getFullYear()} ABClinic. Все права защищены.
            </div>

            <div className="order-1 flex items-center gap-3 md:order-2">
              {socialLinks.map((social) => (
                <MagneticButton
                  key={social.label}
                  as="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="footer-glass-pill flex size-11 items-center justify-center rounded-full"
                >
                  <HugeiconsIcon icon={social.icon} size={17} color="#ffffff" />
                </MagneticButton>
              ))}
              <div className="footer-glass-pill ml-1 flex cursor-default items-center gap-2 rounded-full px-5 py-2.5">
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase md:text-xs">
                  Сделано с
                </span>
                <span className="animate-footer-heartbeat text-sm text-red-500 md:text-base">❤</span>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase md:text-xs">
                  в Ташкенте
                </span>
              </div>
            </div>

            <div className="order-3 flex flex-wrap items-center justify-center gap-5 text-[10px] text-gray-500 md:text-xs">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Пользовательское соглашение
              </Link>
              <MagneticButton
                as="button"
                onClick={scrollToTop}
                aria-label="Наверх"
                className="footer-glass-pill flex size-9 items-center justify-center rounded-full text-gray-300 hover:text-white"
              >
                <ArrowUp size={14} />
              </MagneticButton>
            </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
