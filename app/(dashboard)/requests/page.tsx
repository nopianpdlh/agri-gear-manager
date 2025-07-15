// app/(dashboard)/requests/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { RequestActions } from "@/components/shared/RequestActions";

export default async function RequestsPage() {
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
  const { data: requests, error } = await supabase
    .from("detailed_borrowing_requests")
    .select(`*`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return (
      <p className="p-6">
        Gagal memuat permintaan peminjaman. Cek konsol untuk detail error.
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen Peminjaman
        </h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Daftar semua permintaan peminjaman yang masuk.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Peminjam</TableHead>
              <TableHead>Peralatan</TableHead>
              <TableHead>Tanggal Pinjam</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request: any) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.user_name || "Pengguna"}
                </TableCell>
                <TableCell>{request.equipment_name}</TableCell>
                <TableCell>
                  {format(new Date(request.start_date), "d MMM yyyy", {
                    locale: id,
                  })}{" "}
                  -{" "}
                  {format(new Date(request.end_date), "d MMM yyyy", {
                    locale: id,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "Disetujui"
                        ? "default"
                        : request.status === "Ditolak"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RequestActions request={request} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
