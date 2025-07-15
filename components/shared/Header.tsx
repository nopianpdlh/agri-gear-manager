// components/shared/Header.tsx
"use client"; // Komponen ini interaktif, jadi kita tandai sebagai Client Component

import { Menu, Search } from "lucide-react";

// Props untuk menerima fungsi toggle sidebar di mobile
interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        {/* Tombol menu untuk mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden mr-4 text-gray-600"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari peralatan..."
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-600 focus:border-green-600"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          Selamat datang, Petani!
        </span>
        <img
          className="h-10 w-10 rounded-full object-cover"
          src="https://placehold.co/100x100/166534/FFFFFF?text=P"
          alt="User avatar"
        />
      </div>
    </header>
  );
}
