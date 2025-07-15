// app/(dashboard)/dashboard/page.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Tractor, Wrench, CalendarClock, Handshake } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default async function DashboardPage() {
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

  // 1. Ambil data statistik
  const { count: totalEquipment, error: equipmentError } = await supabase
    .from("equipment")
    .select("*", { count: "exact", head: true });

  const { count: borrowedEquipment, error: borrowedError } = await supabase
    .from("equipment")
    .select("*", { count: "exact", head: true })
    .eq("status", "Dipinjam");

  const { count: upcomingMaintenance, error: maintenanceError } = await supabase
    .from("maintenance_schedules")
    .select("*", { count: "exact", head: true })
    .eq("status", "Dijadwalkan")
    .gt("due_date", new Date().toISOString());

  // 2. Ambil aktivitas terbaru (3 permintaan peminjaman terakhir)
  const { data: recentActivities, error: activitiesError } = await supabase
    .from("detailed_borrowing_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const stats = [
    { label: "Total Peralatan", value: totalEquipment ?? 0 },
    { label: "Perawatan Akan Datang", value: upcomingMaintenance ?? 0 },
    { label: "Sedang Dipinjam", value: borrowedEquipment ?? 0 },
    { label: "Permintaan Tertunda", value: "N/A" }, // Placeholder untuk nanti
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
          <ul className="mt-4 space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Handshake className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-bold">{activity.user_name}</span>{" "}
                      mengajukan peminjaman untuk{" "}
                      <span className="font-bold">
                        {activity.equipment_name}
                      </span>
                      .
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Belum ada aktivitas terbaru.
              </p>
            )}
          </ul>
        </div>

        {/* Peralatan Sering Dipinjam (Placeholder) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Peralatan Populer</h3>
          <p className="text-sm text-gray-500 mt-4">
            Fitur ini akan segera tersedia.
          </p>
        </div>
      </div>
    </div>
  );
}
