// app/(dashboard)/equipment/[id]/page.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { AddSparePartDialog } from "@/components/shared/AddSparePartDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SparePartActions } from "@/components/shared/SparePartActions";
import { SparePart } from "@/lib/types";
import { SparePartExportActions } from "@/components/shared/SparePartExportActions";

// Tipe data untuk suku cadang

export default async function EquipmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Ambil detail peralatan
  const { data: equipment, error: equipmentError } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", params.id)
    .single();

  // Ambil daftar suku cadang untuk peralatan ini
  const { data: spareParts, error: sparePartsError } = await supabase
    .from("spare_parts")
    .select("*")
    .eq("equipment_id", params.id)
    .order("name", { ascending: true });

  if (equipmentError || !equipment) {
    return <p className="p-6">Peralatan tidak ditemukan.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Bagian Header Detail */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative h-60 w-full md:w-1/3 bg-gray-200 rounded-2xl overflow-hidden">
          <Image
            src={
              equipment.photo_urls?.[0] ||
              "https://placehold.co/600x400/e2e8f0/64748b?text=Tanpa+Foto"
            }
            alt={equipment.name}
            fill={true}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800">{equipment.name}</h2>
          <p className="text-lg text-gray-500 mt-1">
            {equipment.brand} {equipment.model}
          </p>
          <div className="flex gap-4 mt-4">
            <Badge variant="default" className="capitalize">
              {equipment.status}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {equipment.condition}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {equipment.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bagian Suku Cadang */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Daftar Suku Cadang
          </h3>
          <div className="flex items-center gap-2">
            <SparePartExportActions
              data={spareParts || []}
              equipmentName={equipment.name}
            />
            <AddSparePartDialog equipmentId={equipment.id} />
          </div>
        </div>
        <Table>
          <TableCaption>
            Daftar suku cadang yang dibutuhkan untuk peralatan ini.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Suku Cadang</TableHead>
              <TableHead>Spesifikasi</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spareParts?.map((part: SparePart) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{part.name}</TableCell>
                <TableCell>{part.specification || "-"}</TableCell>
                <TableCell>
                  {part.stock <= part.stock_threshold ? (
                    <Badge variant="destructive">
                      Stok Rendah ({part.stock})
                    </Badge>
                  ) : (
                    part.stock
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <SparePartActions part={part} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
