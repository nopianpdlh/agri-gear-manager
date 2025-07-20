// components/shared/LogoutButton.tsx
"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Keluar
      </button>
    </form>
  );
}
