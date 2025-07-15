// app/(dashboard)/dashboard/page.tsx
import { Tractor, Wrench, Users } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Peralatan",
      value: "42",
      change: "+2",
      changeType: "positive",
    },
    {
      label: "Perawatan Akan Datang",
      value: "3",
      change: "",
      changeType: "neutral",
    },
    {
      label: "Sedang Dipinjam",
      value: "5",
      change: "-1",
      changeType: "negative",
    },
    {
      label: "Suku Cadang Kritis",
      value: "8",
      change: "",
      changeType: "neutral",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Tractor className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Traktor Tangan (TR-01) telah dikembalikan oleh Budi.
                </p>
                <p className="text-xs text-gray-500">1 jam yang lalu</p>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Wrench className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Perawatan untuk Mesin Pompa Air (MP-03) jatuh tempo besok.
                </p>
                <p className="text-xs text-gray-500">3 jam yang lalu</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
