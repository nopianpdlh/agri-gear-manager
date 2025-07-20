// components/shared/DashboardClientLayout.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

interface UserProfile {
  role: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface DashboardClientLayoutProps {
  userProfile: UserProfile;
  children: React.ReactNode;
}

export default function DashboardClientLayout({
  userProfile,
  children,
}: DashboardClientLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // --- PERUBAHAN 3: Buat fungsi untuk menutup sidebar ---
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar untuk Desktop, tidak perlu onLinkClick */}
      <div className="hidden md:block">
        <Sidebar userProfile={userProfile} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-30 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* --- PERUBAHAN 4: Teruskan fungsi closeSidebar ke Sidebar mobile --- */}
        <Sidebar userProfile={userProfile} onLinkClick={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userProfile={userProfile} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
