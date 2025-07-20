// app/(dashboard)/borrowing/page.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { BorrowEquipmentDialog } from "@/components/shared/BorrowEquipmentDialog";
import { Equipment } from "@/lib/types";
import Image from "next/image";

export default async function BorrowingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set(name, value, options);
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  // Ambil hanya peralatan yang statusnya 'Tersedia'
  const { data: availableEquipment, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("status", "Tersedia")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching available equipment:", error);
    return <p className="p-6">Gagal memuat peralatan yang tersedia.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pinjam Peralatan</h2>
      </div>

      {availableEquipment.length === 0 ? (
        <p className="text-gray-500">
          Saat ini tidak ada peralatan yang tersedia untuk dipinjam.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableEquipment.map((equipment: Equipment) => (
            <div
              key={equipment.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
            >
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={
                    equipment.photo_urls?.[0] ||
                    "https://placehold.co/600x400/e2e8f0/64748b?text=Tanpa+Foto"
                  }
                  alt={equipment.name}
                  layout="fill"
                  className="object-contain"
                />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-gray-900">
                  {equipment.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {equipment.brand || "Tanpa Merk"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Kondisi:{" "}
                  <span className="font-semibold">{equipment.condition}</span>
                </p>
              </div>
              <div className="p-4 border-t border-gray-100">
                <BorrowEquipmentDialog equipment={equipment} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
