import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ContactPage from './pages/ContactPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ComplexTreatmentPage from './pages/ComplexTreatmentPage';
import PackageDetailPage from './pages/PackageDetailPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ServicesListPage from './pages/admin/ServicesListPage';
import ServiceFormPage from './pages/admin/ServiceFormPage';
import CategoriesPage from './pages/admin/CategoriesPage';

// Lazy load public pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const PriceListPage = lazy(() => import('./pages/PriceListPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Public layout wrapper (header + footer)
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* ── Admin routes (no site header/footer) ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<ServicesListPage />} />
        <Route path="services/new" element={<ServiceFormPage />} />
        <Route path="services/:serviceId/edit" element={<ServiceFormPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>

      {/* ── Public routes (with header/footer) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/complex-treatment" element={<ComplexTreatmentPage />} />
        <Route path="/complex-treatment/:packageId" element={<PackageDetailPage />} />
        <Route path="/services" element={<PriceListPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
