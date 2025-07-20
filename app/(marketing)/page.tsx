// app/(marketing)/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Tractor, BarChart, CalendarCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: <Tractor className="h-10 w-10 text-green-600" />,
      title: "Inventaris Terpusat",
      description:
        "Lacak semua data peralatan—mulai dari traktor hingga cangkul—di satu dasbor yang mudah diakses.",
    },
    {
      icon: <CalendarCog className="h-10 w-10 text-green-600" />,
      title: "Jadwal Perawatan",
      description:
        "Jangan lewatkan jadwal servis lagi. Dapatkan pengingat otomatis untuk menjaga aset Anda tetap prima.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-green-600" />,
      title: "Laporan & Analisis Biaya",
      description:
        "Pahami biaya operasional setiap alat dengan fitur pelacakan dan ekspor laporan ke PDF atau Excel.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-green-600" />,
      title: "Manajemen Peminjaman",
      description:
        "Kelola siapa yang meminjam, kapan, dan bagaimana statusnya melalui sistem persetujuan internal.",
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
              Modernisasi Manajemen Aset Pertanian Anda
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Agri-Gear adalah solusi lengkap untuk melacak, merawat, dan
              mengelola semua peralatan pertanian Anda secara efisien.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                asChild
                className="bg-green-700 hover:bg-green-800"
              >
                <Link href="/register">Mulai Gratis Sekarang</Link>
              </Button>
            </div>
          </div>
          <div>
            <Image
              src="/rice-field-bro.svg"
              alt="Ilustrasi Manajemen Pertanian Cerdas"
              width={900}
              height={900}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-gray-600 mt-2">
              Fitur-fitur yang dirancang untuk petani modern.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800">Cara Kerja</h2>
            <p className="text-gray-600 mt-2">Hanya dalam 3 langkah mudah.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-5xl font-bold text-green-200 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Daftar Akun</h3>
              <p className="text-gray-600">
                Buat akun gratis Anda dalam hitungan detik untuk memulai.
              </p>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold text-green-200 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Input Data Alat</h3>
              <p className="text-gray-600">
                Masukkan semua data peralatan Anda, lengkap dengan foto dan
                detailnya.
              </p>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold text-green-200 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Mulai Kelola</h3>
              <p className="text-gray-600">
                Lacak peminjaman, jadwal servis, dan analisis biaya operasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-green-800 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">
            Siap Mengoptimalkan Aset Pertanian Anda?
          </h2>
          <p className="mt-4 mb-8 max-w-xl mx-auto">
            Bergabunglah dengan ratusan petani dan kelompok tani yang telah
            beralih ke manajemen digital.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
