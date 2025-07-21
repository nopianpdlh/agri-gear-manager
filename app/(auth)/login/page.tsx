// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  signInWithGoogleAction,
  loginAction,
  forgotPasswordAction,
} from "@/app/actions";
import { toast } from "sonner";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleLogin = async (formData: FormData) => {
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
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

  const handleForgotPassword = async () => {
    toast.info("Mengirim email...");
    const result = await forgotPasswordAction(forgotPasswordEmail);
    if (result?.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Email Terkirim!", {
        description:
          "Silakan periksa kotak masuk Anda untuk link reset kata sandi.",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-green-800">
              Selamat Datang Kembali
            </h1>
            <p className="text-balance text-muted-foreground">
              Masukkan email Anda untuk masuk ke akun Agri-Gear
            </p>
          </div>
          <form action={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="petani@contoh.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Lupa kata sandi?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Lupa Kata Sandi</DialogTitle>
                      <DialogDescription>
                        Masukkan email Anda. Kami akan mengirimkan link untuk
                        mengatur ulang kata sandi Anda.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="forgot-email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) =>
                            setForgotPasswordEmail(e.target.value)
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleForgotPassword}>Kirim Link</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
            >
              Masuk
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Masuk dengan Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="underline">
              Daftar
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/rice-field-amico.svg"
          alt="Gambar Lahan Pertanian"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
