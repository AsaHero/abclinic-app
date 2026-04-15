import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getServices, getCategories } from '@/api/services';
import { Stethoscope, Tag, Star, Sparkles, ArrowRight } from 'lucide-react';

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string }> = ({
  label, value, icon, color,
}) => (
  <div className={`bg-[#1a1e25] border border-white/8 rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => getServices() });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const popular = services.filter((s) => s.popular).length;
  const specialOffers = services.filter((s) => s.isSpecialOffer).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your clinic services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total services"
          value={services.length}
          icon={<Stethoscope size={20} className="text-blue-400" />}
          color="bg-blue-500/10"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={<Tag size={20} className="text-purple-400" />}
          color="bg-purple-500/10"
        />
        <StatCard
          label="Popular"
          value={popular}
          icon={<Star size={20} className="text-yellow-400" />}
          color="bg-yellow-500/10"
        />
        <StatCard
          label="Special offers"
          value={specialOffers}
          icon={<Sparkles size={20} className="text-pink-400" />}
          color="bg-pink-500/10"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/services/new"
          className="flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 rounded-2xl p-5 transition-colors group"
        >
          <div>
            <p className="font-medium text-white">Add a service</p>
            <p className="text-sm text-gray-400 mt-0.5">Create a new service listing</p>
          </div>
          <ArrowRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/categories"
          className="flex items-center justify-between bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 rounded-2xl p-5 transition-colors group"
        >
          <div>
            <p className="font-medium text-white">Manage categories</p>
            <p className="text-sm text-gray-400 mt-0.5">Edit or reorder categories</p>
          </div>
          <ArrowRight size={20} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">All services</h2>
          <Link to="/admin/services" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl overflow-hidden">
          {services.slice(0, 8).map((svc, i) => (
            <Link
              key={svc.id}
              to={`/admin/services/${svc.id}/edit`}
              className={`flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors ${
                i !== 0 ? 'border-t border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm text-white truncate">{svc.name}</span>
                {svc.popular && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full shrink-0">Popular</span>
                )}
                {svc.isSpecialOffer && (
                  <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full shrink-0">Offer</span>
                )}
              </div>
              <span className="text-sm text-gray-400 shrink-0 ml-4">
                {svc.price.toLocaleString('ru-RU')} сум
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
