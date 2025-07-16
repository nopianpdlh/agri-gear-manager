// app/(dashboard)/maintenance/page.tsx
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
import { MaintenanceActions } from "@/components/shared/MaintenanceActions";
import { MaintenanceExportActions } from "@/components/shared/MaintenanceExportActions";

export default async function MaintenancePage() {
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

  const { data: schedules, error } = await supabase
    .from("maintenance_schedules")
    .select(
      `
      id,
      due_date,
      description,
      status,
      equipment ( id, name )
    `
    )
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching maintenance schedules:", error);
    return <p className="p-6">Gagal memuat jadwal perawatan.</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Jadwal Perawatan</h2>
        <MaintenanceExportActions data={schedules || []} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Daftar semua jadwal perawatan yang terdaftar.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Peralatan</TableHead>
              <TableHead>Tanggal Jatuh Tempo</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules?.map((schedule: any) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  {schedule.equipment.name}
                </TableCell>
                <TableCell>
                  {format(new Date(schedule.due_date), "PPP", { locale: id })}
                </TableCell>
                <TableCell>{schedule.description || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      schedule.status === "Selesai"
                        ? "default"
                        : schedule.status === "Dibatalkan"
                        ? "secondary"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {schedule.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <MaintenanceActions schedule={schedule} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
