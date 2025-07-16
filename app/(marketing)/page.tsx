// app/(marketing)/page.tsx
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    "Manajemen Inventaris Terpusat",
    "Jadwal Perawatan Otomatis",
    "Sistem Peminjaman Internal",
    "Laporan & Riwayat Penggunaan",
  ];

  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-5xl font-bold text-green-800">
        Kelola Peralatan Pertanian Anda dengan Mudah
      </h1>
      <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
        Agri-Gear Manager membantu Anda melacak, merawat, dan mengoptimalkan
        penggunaan semua aset pertanian Anda di satu tempat.
      </p>
      <div className="mt-8">
        <Button size="lg" asChild>
          <Link href="/register">Mulai Gratis Sekarang</Link>
        </Button>
      </div>

      <div className="mt-20 text-left max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Fitur Unggulan Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <p className="text-lg text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
