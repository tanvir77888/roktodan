// src/app/admin/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart2,
  Droplet,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <BarChart2 size={18} />,
  },
  {
    label: "Donors",
    href: "/admin/donors",
    icon: <Droplet size={18} />,
  },
  {
    label: "Blood Requests",
    href: "/admin/requests",
    icon: <AlertTriangle size={18} />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

function SidebarContent({
  pathname,
  onNavClick,
  onLogout,
  loggingOut,
}: {
  pathname: string;
  onNavClick?: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Droplet size={22} className="text-red-400 flex-shrink-0" />
          <span className="font-bold text-white text-base leading-tight">
            Roktho Bondhon
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-1 ml-7">Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
        >
          <LogOut size={18} className="text-gray-400" />
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout");
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 text-white fixed inset-y-0 left-0 z-30">
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent
          pathname={pathname}
          onNavClick={() => setMobileOpen(false)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Droplet size={18} className="text-red-500" />
            <span className="font-semibold text-gray-800 text-sm">
              Roktho Bondhon
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}