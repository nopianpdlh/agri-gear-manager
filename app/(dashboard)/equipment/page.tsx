// app/(dashboard)/equipment/page.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Equipment } from "@/lib/types";
import { AddEquipmentDialog } from "@/components/shared/AddEquipmentDialog";

export default async function EquipmentPage() {
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

  const { data: equipment, error } = await supabase
    .from("equipment")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching equipment:", error);
    return <p>Gagal memuat data peralatan.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Peralatan</h2>
        <AddEquipmentDialog />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Daftar semua peralatan pertanian yang terdaftar.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nama Peralatan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Tahun Beli</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment?.map((item: Equipment) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.purchase_year}</TableCell>
                <TableCell className="text-right">
                  {/* Tombol aksi akan ditambahkan di sini */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
