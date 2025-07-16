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
import { Badge } from "@/components/ui/badge";
import { EquipmentActions } from "@/components/shared/EquipmentActions";
import Link from "next/link";
import { ExportButton } from "@/components/shared/ExportButton";
import { ExportPdfButton } from "@/components/shared/ExportPdfButton";
import { EquipmentExportActions } from "@/components/shared/EquipmentExportActions";

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

  // Ambil data sesi dan profil pengguna
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", session!.user.id)
    .single();

  const { data: equipment, error } = await supabase
    .from("equipment")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching equipment:", error);
    return <p className="p-6">Gagal memuat data peralatan.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Peralatan</h2>

        {/*  tampilkan tombol  */}

        <div className="flex items-center gap-2">
          <EquipmentExportActions data={equipment || []} />
          {/* <-- Tambahkan tombol PDF */}
          {userProfile?.role === "admin" && <AddEquipmentDialog />}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Daftar semua peralatan pertanian yang terdaftar.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nama Peralatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Kondisi</TableHead>
              {/* Hanya tampilkan kolom Aksi untuk admin */}
              {userProfile?.role === "admin" && (
                <TableHead className="text-right">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment?.map((item: Equipment) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/equipment/${item.id}`}
                    className="hover:underline text-blue-600"
                  >
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Tersedia"
                        ? "default"
                        : item.status === "Dalam Perawatan"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.condition}</TableCell>
                {/* Hanya tampilkan sel Aksi untuk admin */}
                {userProfile?.role === "admin" && (
                  <TableCell className="text-right">
                    <EquipmentActions equipment={item} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
