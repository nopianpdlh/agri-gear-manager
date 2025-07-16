// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
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
import { signUpAction, signInWithGoogleAction } from "@/app/actions"; // Kita akan buat ini selanjutnya
import { toast } from "sonner";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (formData: FormData) => {
    const result = await signUpAction(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setError(null);
      toast.success("Pendaftaran Berhasil!", {
        description:
          "Silakan cek email Anda untuk verifikasi dan kemudian login.",
      });
      // Arahkan ke halaman login atau tampilkan pesan sukses
    }
  };

  const handleGoogleSignUp = async () => {
    const result = await signInWithGoogleAction();
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-green-800">
            Buat Akun Baru
          </CardTitle>
          <CardDescription>
            Mulai kelola aset pertanian Anda hari ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Nama Anda"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="petani@contoh.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Daftar dengan Email
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
          >
            Lanjutkan dengan Google
          </Button>
          <p className="text-sm text-center text-gray-600 mt-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-green-700 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
