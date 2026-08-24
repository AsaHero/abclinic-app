"use client";

// src/components/home/HomePageBody.tsx
//
// Funnel order (2026-08-22, per the owner's chain + the mentor library —
// see business/ab-clinic-homepage-funnel-2026-08.md in the wiki for the
// full reasoning): Hero (hook) -> FitSection (Hunt ladder: "recognize the
// problem") -> ValueShiftSection (escalate severity + stakes, "want to
// solve it") -> FounderSection ("trust this expert" begins) ->
// MethodologySection (trust continues — moved here from the tail on his
// explicit request, "how we work" belongs right after "who I am") ->
// ServicesSection (now that trust exists, what's actually on offer) ->
// BeforeAfterSection + ReviewsSection (Hunt's top rung: proof, case-story
// format) -> ObjectionsSection (last friction before the ask, not first)
// -> Heritage/Gallery (supporting credibility) -> Contact (the close).
import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ValueShiftSection from "@/components/home/ValueShiftSection";
import FitSection from "@/components/home/FitSection";
import FounderSection from "@/components/home/FounderSection";
import ObjectionsSection from "@/components/home/ObjectionsSection";
import ServicesSection from "@/components/home/ServicesSection";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import MethodologySection from "@/components/home/MethodologySection";
import HeritageStripSection from "@/components/home/HeritageStripSection";
import GalleryStripSection from "@/components/home/GalleryStripSection";
import ContactMapSection from "@/components/home/ContactMapSection";
import type { BeforeAfterCase } from "@/lib/services/queries";

const HomePageBody = ({ beforeAfterCases }: { beforeAfterCases: BeforeAfterCase[] }) => {
  // Setup page entry - simplified to avoid white flashes
  useEffect(() => {
    // Smooth scroll restoration
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      <FitSection />
      <ValueShiftSection />
      <FounderSection />
      <MethodologySection />
      <ServicesSection />
      <BeforeAfterSection cases={beforeAfterCases} />
      <ReviewsSection />
      <ObjectionsSection />
      <HeritageStripSection />
      <GalleryStripSection />
      <ContactMapSection />
    </div>
  );
};

export default HomePageBody;
