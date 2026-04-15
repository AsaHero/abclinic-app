import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Tag,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/services', label: 'Services', icon: Stethoscope, end: false },
  { to: '/admin/categories', label: 'Categories', icon: Tag, end: false },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth gate — redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#13171d] border-r border-white/8">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/8">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">Admin</p>
        <p className="text-white font-semibold text-lg leading-tight">abclinic.uz</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/8 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          View site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-60 h-full flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#13171d]">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold">abclinic admin</span>
          <div className="w-6" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
