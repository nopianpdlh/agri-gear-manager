// app/(dashboard)/layout.tsx
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { redirect } from "next/navigation";
import DashboardClientLayout from "@/components/shared/DashboardClientLayout"; // Impor komponen baru

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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }

  const { data: userProfile, error } = await supabase
    .from("users")
    .select("role, full_name, avatar_url")
    .eq("id", session.user.id)
    .single();

  if (error || !userProfile) {
    console.error("Gagal mengambil profil pengguna:", error);
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Gunakan komponen klien sebagai pembungkus */}
      <DashboardClientLayout userProfile={userProfile}>
        {children}
      </DashboardClientLayout>
    </div>
  );
}
