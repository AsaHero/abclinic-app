import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// This is the ROOT not-found — Next.js falls back to it for any URL that
// doesn't match a route segment at all (mistyped links, old bookmarks),
// which is the vast majority of real 404s. It sits outside the (public)
// route group, so it doesn't inherit that group's layout automatically —
// Header/Footer are rendered directly here instead. The (public)/not-found.tsx
// sibling only fires for notFound() calls from within an already-matched
// public route (e.g. a service ID that doesn't exist) and stays separate.
export const metadata = {
  title: "Страница не найдена — abclinic.uz",
  description: "404",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-900">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-32 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8 text-white/70">Страница не найдена</p>
        <Link href="/" className="text-forest-400 hover:text-forest-300 underline transition-colors">
          Вернуться на главную
        </Link>
      </main>
      <Footer />
    </div>
  );
}
