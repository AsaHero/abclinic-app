import Link from "next/link";

export const metadata = {
  title: "Страница не найдена — abclinic.uz",
  description: "404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Страница не найдена</p>
      <Link href="/" className="btn btn-primary">
        Вернуться на главную
      </Link>
    </div>
  );
}
