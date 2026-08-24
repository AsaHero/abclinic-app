"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Stethoscope, Tag, Users, Newspaper, Inbox, LogOut, Menu, ExternalLink } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

const NAV = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Заявки", icon: Inbox, end: false },
  { to: "/admin/services", label: "Услуги", icon: Stethoscope, end: false },
  { to: "/admin/categories", label: "Категории", icon: Tag, end: false },
  { to: "/admin/team", label: "Команда", icon: Users, end: false },
  { to: "/admin/blog", label: "Блог", icon: Newspaper, end: false },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (to: string, end: boolean) => (end ? pathname === to : pathname.startsWith(to));

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-[#13171d] border-r border-white/8">
      <div className="px-5 py-5 border-b border-white/8">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">Admin</p>
        <p className="text-white font-semibold text-lg leading-tight">abclinic.uz</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <Link
            key={to}
            href={to}
            className={navLinkClass(isActive(to, end))}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/8 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} />
          Смотреть сайт
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
      <div className="hidden md:flex flex-col w-60 flex-shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 h-full flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#13171d]">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
            className="text-gray-400 hover:text-white"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold">abclinic admin</span>
          <div className="w-6" />
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
