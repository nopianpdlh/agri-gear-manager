// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/shared/NoSSR";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agri-Gear Manager",
  description: "Manajemen inventaris pertanian modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <ClientOnly>
          <Toaster richColors />
        </ClientOnly>
      </body>
    </html>
  );
}
