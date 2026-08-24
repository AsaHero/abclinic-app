"use client";

import React from "react";

// "Liquid glass" effect primitives — a frosted-glass look with a subtle
// refraction/specular-highlight distortion (via the shared SVG filter in
// GlassFilter), styled after Apple's Liquid Glass design language.
// Needs something with visual contrast behind it (a photo, gradient, or
// busy background) to actually show the distortion — over a flat solid
// color it still looks fine, just closer to plain frosted glass.

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  as?: "div" | "button";
  onClick?: () => void;
}

// The three stacked layers that create the glass look (blur+distortion tint,
// specular inset highlight) — no content, no wrapping element. Drop this
// inside any existing clickable container (an `<a>`, `<button>`, whatever)
// that's `position: relative` and `overflow: hidden`, alongside your own
// content wrapped in `relative z-30` so it sits above the layers.
export const GlassLayers: React.FC = () => (
  <>
    <div
      className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      style={{
        backdropFilter: "blur(3px)",
        filter: "url(#glass-distortion)",
        isolation: "isolate",
      }}
    />
    <div className="absolute inset-0 z-10 rounded-[inherit]" style={{ background: "rgba(255, 255, 255, 0.25)" }} />
    <div
      className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
      style={{
        boxShadow: "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
      }}
    />
  </>
);

export const glassBoxShadow = "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)";
export const glassTransitionTiming = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  as = "div",
  onClick,
}) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: glassBoxShadow,
    transitionTimingFunction: glassTransitionTiming,
    ...style,
  };

  const content = (
    <>
      <GlassLayers />
      <div className="relative z-30">{children}</div>
    </>
  );

  const sharedClassName = `relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-700 ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel="noopener noreferrer" className="block">
        <div className={sharedClassName} style={glassStyle}>
          {content}
        </div>
      </a>
    );
  }

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={sharedClassName} style={glassStyle}>
        {content}
      </button>
    );
  }

  return (
    <div className={sharedClassName} style={glassStyle} onClick={onClick}>
      {content}
    </div>
  );
};

export const GlassButton: React.FC<{
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, href, onClick, className = "" }) => (
  <GlassEffect
    href={href}
    onClick={onClick}
    as={href ? "div" : "button"}
    className={`rounded-3xl px-8 py-4 hover:px-9 hover:py-[18px] hover:rounded-4xl overflow-hidden ${className}`}
  >
    <div
      className="transition-all duration-700 hover:scale-95"
      style={{ transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)" }}
    >
      {children}
    </div>
  </GlassEffect>
);

// Renders the shared SVG distortion filter every GlassEffect instance
// references via `url(#glass-distortion)`. Mount once near the root of the
// page (or layout) that uses any glass component — filters are global by
// id, no need to repeat it per instance.
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
      <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves={1} seed={17} result="turbulence" />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
        <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
        <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale={5}
        specularConstant={1}
        specularExponent={100}
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x={-200} y={-200} z={300} />
      </feSpecularLighting>
      <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage" />
      <feDisplacementMap in="SourceGraphic" in2="softMap" scale={200} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);
