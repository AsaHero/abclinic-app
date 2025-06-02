import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ContactPage from './pages/ContactPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ComplexTreatmentPage from './pages/ComplexTreatmentPage';
import PackageDetailPage from './pages/PackageDetailPage';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const PriceListPage = lazy(() => import('./pages/PriceListPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/complex-treatment" element={<ComplexTreatmentPage />} />
            <Route path="/complex-treatment/:packageId" element={<PackageDetailPage />} />
            <Route path="/services" element={<PriceListPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {/* <ScrollManager /> */}
    </div>
  );
}

export default App;
