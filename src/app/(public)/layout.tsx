import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GlassFilter } from "@/components/ui/liquid-glass";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <GlassFilter />
      <Header />
      {/* "Reveal footer" technique: the negative margin-bottom pulls main's
          box up so it visually overlaps the sticky footer's full height,
          and the trailing spacer div adds 100vh of *empty* scrollable space
          back inside main so there's actually somewhere to scroll THROUGH
          main's transparent tail, revealing the sticky footer (z-0) sitting
          behind it (z-10). See Footer.tsx for the other half of this pairing.

          `main` itself is pointer-events-none: an element's own box stays
          hit-testable across its full height regardless of what its
          children paint, so pointer-events:none on just the spacer wasn't
          enough — clicks over the "empty" tail still resolved to `main`,
          never reaching the footer behind it. Disabling pointer events on
          `main` and re-enabling them only on the real-content wrapper lets
          clicks pass through the spacer's region straight to the footer,
          while every actual page element stays fully clickable. */}
      <main className="relative z-10 flex-grow -mb-[100vh] pointer-events-none">
        <div className="pointer-events-auto">{children}</div>
        <div aria-hidden="true" className="h-screen w-full" />
      </main>
      <Footer />
    </div>
  );
}
