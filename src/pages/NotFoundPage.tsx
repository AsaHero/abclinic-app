// src/pages/NotFoundPage.tsx
import SeoLite from '@/components/seo/SeoLite';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <>
      <SeoLite
        title="Страница не найдена — abclinic.uz"
        description="404"
        url="https://abclinic.uz/404"
        noindex
      />

      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Страница не найдена</p>
        <Link to="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
