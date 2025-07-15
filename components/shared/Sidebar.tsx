// components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tractor,
  Wrench,
  CalendarClock,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/equipment", label: "Peralatan", icon: Tractor },
  { href: "/maintenance", label: "Jadwal Perawatan", icon: Wrench },
  { href: "/borrowing", label: "Peminjaman", icon: CalendarClock },
  { href: "/users", label: "Manajemen Pengguna", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-green-800">Agri-Gear</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              pathname.startsWith(item.href)
                ? "bg-green-100 text-green-800"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200">
        <Link
          href="/login"
          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </Link>
      </div>
    </aside>
  );
}
