// components/shared/Header.tsx
"use client";

import { Menu, Search } from "lucide-react";

// Definisikan tipe untuk profil pengguna
interface UserProfile {
  role: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface HeaderProps {
  userProfile: UserProfile;
}

export default function Header({ userProfile }: HeaderProps) {
  // Buat inisial dari nama jika tidak ada avatar
  const initial = userProfile.full_name
    ? userProfile.full_name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        {/* Tombol menu untuk mobile (akan kita fungsikan nanti) */}
        <button className="md:hidden mr-4 text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
        {/* ... (search bar) ... */}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          Selamat datang,{" "}
          <span className="font-semibold">
            {userProfile.full_name || "Pengguna"}
          </span>
          !
        </span>
        <img
          className="h-10 w-10 rounded-full object-cover bg-green-200 text-green-800 flex items-center justify-center font-bold"
          src={
            userProfile.avatar_url ||
            `https://placehold.co/100x100/166534/FFFFFF?text=${initial}`
          }
          alt={userProfile.full_name || "User avatar"}
        />
      </div>
    </header>
  );
}
