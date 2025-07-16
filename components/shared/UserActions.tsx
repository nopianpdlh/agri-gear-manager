// components/shared/UserActions.tsx
"use client";

import {
  MoreHorizontal,
  ShieldCheck,
  User as UserIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User } from "@/lib/types";
import { changeUserRoleAction } from "@/app/actions";

interface UserActionsProps {
  user: User;
  currentUserId: string | undefined;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  // Nonaktifkan aksi jika pengguna adalah pengguna yang sedang login
  if (user.id === currentUserId) {
    return <span className="text-sm text-gray-400">Anda</span>;
  }

  const handleChangeRole = async (newRole: "admin" | "member") => {
    toast.info(`Mengubah peran menjadi ${newRole}...`);
    const result = await changeUserRoleAction(user.id, newRole);
    if (result.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Ubah Peran</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleChangeRole("admin")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Admin</span>
                {user.role === "admin" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeRole("member")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Anggota</span>
                {user.role === "member" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
