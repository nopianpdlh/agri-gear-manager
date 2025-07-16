// app/(marketing)/layout.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tractor } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-green-800"
          >
            <Tractor className="h-7 w-7" />
            Agri-Gear
          </Link>
          <nav className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-100 p-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Agri-Gear Manager. Semua Hak Cipta
          Dilindungi.
        </div>
      </footer>
    </div>
  );
}
