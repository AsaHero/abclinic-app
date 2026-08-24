"use client";

import type React from "react";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";

// Same "flowing 3D depth gallery" effect as before, but built on CSS 3D
// transforms (perspective + translate3d + filter: blur) instead of WebGL —
// no Canvas, no shader, no GPU context that a driver can crash. CSS 3D
// transforms are composited the same way as any other CSS animation, which
// is about as universally supported as web rendering gets; there's no
// "WebGL unsupported" case to fall back from here.

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
  onActiveIndexChange?: (index: number) => void;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEPTH_RANGE = 50; // same abstract unit range as the old scene, kept so fade/blur settings tuned against it still apply unchanged
const MAX_DEPTH_PX = 1600; // how far back (in CSS px) the far end of that range sits
const MAX_HORIZONTAL_OFFSET_PX = 220;
const MAX_VERTICAL_OFFSET_PX = 160;
const CARD_WIDTH_PX = 300;
const CARD_HEIGHT_PX = 380;

export default function InfiniteGallery({
  images,
  speed = 1,
  visibleCount = 6,
  className = "h-96 w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
  onActiveIndexChange,
}: InfiniteGalleryProps) {
  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === "string" ? { src: img, alt: "" } : img)),
    [images],
  );
  const totalImages = normalizedImages.length;
  const count = visibleCount ?? 6;

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const scrollVelocityRef = useRef(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastInteraction = useRef(Date.now());
  const lastReportedIndex = useRef<number | null>(null);
  const lastImageIndex = useRef<number[]>([]);

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;
      const x = (Math.sin(horizontalAngle) * horizontalRadius * MAX_HORIZONTAL_OFFSET_PX) / 3;
      const y = (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET_PX) / 4;
      positions.push({ x, y });
    }
    return positions;
  }, [count]);

  const planesData = useRef<PlaneData[]>(
    Array.from({ length: count }, (_, i) => ({
      index: i,
      z: count > 0 ? ((DEPTH_RANGE / count) * i) % DEPTH_RANGE : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    })),
  );

  useEffect(() => {
    planesData.current = Array.from({ length: count }, (_, i) => ({
      index: i,
      z: count > 0 ? ((DEPTH_RANGE / Math.max(count, 1)) * i) % DEPTH_RANGE : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
    lastImageIndex.current = planesData.current.map((p) => p.imageIndex);
  }, [count, spatialPositions, totalImages]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      scrollVelocityRef.current += event.deltaY * 0.01 * speed;
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        scrollVelocityRef.current -= 2 * speed;
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        scrollVelocityRef.current += 2 * speed;
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      }
    },
    [speed],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setAutoPlay(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useAnimationFrame((_time, deltaMs) => {
    const delta = Math.min(deltaMs / 1000, 0.1); // clamp so a slow/backgrounded tab doesn't jump

    if (autoPlay) {
      scrollVelocityRef.current += 0.3 * delta;
    }
    scrollVelocityRef.current *= 0.95;
    const scrollVelocity = scrollVelocityRef.current;

    const imageAdvance = totalImages > 0 ? count % totalImages || totalImages : 0;
    let closestPlane: PlaneData | null = null;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= DEPTH_RANGE) {
        wrapsForward = Math.floor(newZ / DEPTH_RANGE);
        newZ -= DEPTH_RANGE * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / DEPTH_RANGE);
        newZ += DEPTH_RANGE * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }
      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;

      const normalizedPosition = plane.z / DEPTH_RANGE;
      let opacity = 1;

      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        opacity =
          (normalizedPosition - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
        opacity =
          1 -
          (normalizedPosition - fadeSettings.fadeOut.start) /
            (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0;
      }
      opacity = Math.max(0, Math.min(1, opacity));

      if (!closestPlane || Math.abs(normalizedPosition - 0.2) < Math.abs(closestPlane.z / DEPTH_RANGE - 0.2)) {
        if (opacity > 0.5) closestPlane = plane;
      }

      let blur = 0;
      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        blur =
          blurSettings.maxBlur *
          (1 - (normalizedPosition - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start));
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur;
      } else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
        blur =
          blurSettings.maxBlur *
          ((normalizedPosition - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start));
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur;
      }
      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      const zPx = -MAX_DEPTH_PX + normalizedPosition * MAX_DEPTH_PX * 2;
      const scale = Math.max(0.4, 1 + zPx / (MAX_DEPTH_PX * 2.2));

      const item = itemRefs.current[i];
      if (item) {
        item.style.transform = `translate(-50%, -50%) translate3d(${plane.x}px, ${plane.y}px, ${zPx}px) scale(${scale})`;
        item.style.opacity = String(opacity);
        item.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "none";
      }

      if (lastImageIndex.current[i] !== plane.imageIndex) {
        lastImageIndex.current[i] = plane.imageIndex;
        const img = imgRefs.current[i];
        const src = normalizedImages[plane.imageIndex]?.src;
        if (img && src) img.src = src;
        if (img) img.alt = normalizedImages[plane.imageIndex]?.alt ?? "";
      }
    });

    if (closestPlane && onActiveIndexChange) {
      const idx = (closestPlane as PlaneData).imageIndex;
      if (lastReportedIndex.current !== idx) {
        lastReportedIndex.current = idx;
        onActiveIndexChange(idx);
      }
    }
  });

  if (normalizedImages.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, position: "relative", overflow: "hidden", perspective: "1200px" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: CARD_WIDTH_PX,
            height: CARD_HEIGHT_PX,
            marginLeft: -CARD_WIDTH_PX / 2,
            marginTop: -CARD_HEIGHT_PX / 2,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            willChange: "transform, filter, opacity",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            src={normalizedImages[i % normalizedImages.length]?.src}
            alt={normalizedImages[i % normalizedImages.length]?.alt ?? ""}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
