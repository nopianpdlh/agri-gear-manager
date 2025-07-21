// app/[locale]/not-found.tsx

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="max-w-md">
        <Image
          src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg"
          alt="Ilustrasi Halaman Tidak Ditemukan"
          width={400}
          height={400}
          className="mx-auto"
        />
        <h1 className="mt-8 text-4xl font-bold text-green-800">
          404 - Halaman Tidak Ditemukan
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau
          tidak pernah ada.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-green-700 hover:bg-green-800">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
