// app/auth/reset-password/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { updateUserPasswordAction } from "@/app/actions";

// Komponen ini berisi logika form dan penggunaan hook
function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Mencegah reload halaman standar

    if (password !== confirmPassword) {
      toast.error("Gagal!", {
        description: "Konfirmasi kata sandi tidak cocok.",
      });
      return;
    }

    // Kita tidak perlu mengirimkan code, Supabase menanganinya via sesi
    const result = await updateUserPasswordAction(password);
    if (result?.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", {
        description:
          "Kata sandi Anda telah berhasil diperbarui. Silakan login.",
      });
      // Kosongkan form setelah berhasil
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">
          Atur Ulang Kata Sandi
        </CardTitle>
        <CardDescription>
          Masukkan kata sandi baru Anda di bawah ini.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Kata Sandi Baru</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full">
            Simpan Kata Sandi Baru
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Komponen Halaman utama yang membungkus form dengan Suspense
export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense
        fallback={
          <Card className="w-full max-w-md p-8 text-center">
            Memuat formulir...
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
