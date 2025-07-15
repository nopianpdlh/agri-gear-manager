// app/(dashboard)/history/page.tsx
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
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function HistoryPage() {
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

  // Ambil data dari VIEW yang baru dibuat
  const { data: usageHistory, error } = await supabase
    .from("detailed_usage_history")
    .select(`*`)
    .order("return_date", { ascending: false });

  if (error) {
    console.error("Error fetching usage history:", error);
    return <p className="p-6">Gagal memuat riwayat penggunaan.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Penggunaan</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Catatan semua aktivitas peminjaman peralatan yang telah selesai.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Peralatan</TableHead>
              <TableHead>Peminjam</TableHead>
              <TableHead>Tanggal Pinjam</TableHead>
              <TableHead>Tanggal Kembali</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usageHistory?.map((history: any) => (
              <TableRow key={history.id}>
                <TableCell className="font-medium">
                  {history.equipment_name}
                </TableCell>
                <TableCell>{history.user_name}</TableCell>
                <TableCell>
                  {format(new Date(history.start_date), "d MMM yyyy, HH:mm", {
                    locale: id,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(history.return_date), "d MMM yyyy, HH:mm", {
                    locale: id,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
