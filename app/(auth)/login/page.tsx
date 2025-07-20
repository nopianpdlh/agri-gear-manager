// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { signInWithGoogleAction } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Redirect ke dashboard setelah login berhasil
      router.push("/dashboard");
      router.refresh(); // Refresh untuk memastikan state server terupdate
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogleAction();
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <Card className="w-full max-w-md shadow-lg relative">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-4xl font-bold text-green-800">
            Selamat Datang di Agri-Gear Manager
          </CardTitle>
          <CardDescription>
            Masuk untuk melanjutkan ke dashboard Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="petani@contoh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Masuk dengan Email
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
            onClick={handleGoogleSignIn}
          >
            Masuk dengan Google
          </Button>
          <p className="text-sm text-center text-gray-600 mt-6">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-green-700 hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
