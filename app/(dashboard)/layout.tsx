// app/(dashboard)/layout.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
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

  // Ambil data sesi pengguna
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika tidak ada sesi, arahkan ke halaman login
  if (!session) {
    redirect("/login");
  }

  // Ambil data profil/peran dari tabel 'users'
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("role, full_name, avatar_url")
    .eq("id", session.user.id)
    .single();

  if (error || !userProfile) {
    // Handle kasus di mana profil tidak ditemukan, mungkin arahkan ke halaman setup profil
    console.error("Gagal mengambil profil pengguna:", error);
    // Untuk sementara, kita bisa arahkan ke login jika profil gagal dimuat
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Teruskan data profil pengguna ke Sidebar */}
      <Sidebar userProfile={userProfile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Teruskan data profil pengguna ke Header */}
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
