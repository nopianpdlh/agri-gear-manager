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
  Handshake,
  History,
} from "lucide-react";

// Definisikan tipe untuk profil pengguna
interface UserProfile {
  role: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface SidebarProps {
  userProfile: UserProfile;
}

// Definisikan item menu untuk setiap peran
const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/equipment", label: "Peralatan", icon: Tractor },
  { href: "/maintenance", label: "Jadwal Perawatan", icon: Wrench },
  { href: "/borrowing", label: "Pinjam Alat", icon: CalendarClock },
  { href: "/requests", label: "Manajemen Pinjaman", icon: Handshake },
  { href: "/history", label: "Riwayat Penggunaan", icon: History },
  { href: "/users", label: "Manajemen Pengguna", icon: Users },
];

const memberNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/equipment", label: "Peralatan", icon: Tractor },
  { href: "/maintenance", label: "Jadwal Perawatan", icon: Wrench },
  { href: "/borrowing", label: "Pinjam Alat", icon: CalendarClock },
  { href: "/history", label: "Riwayat Saya", icon: History },
];

export default function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();

  // Pilih set menu berdasarkan peran pengguna
  const navItems =
    userProfile.role === "admin" ? adminNavItems : memberNavItems;

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
        {/* Tombol Logout akan kita perbaiki nanti */}
        <a
          href="/login"
          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Keluar
        </a>
      </div>
    </aside>
  );
}
