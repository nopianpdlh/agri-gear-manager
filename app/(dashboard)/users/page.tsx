// app/(dashboard)/users/page.tsx
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
import { UserActions } from "@/components/shared/UserActions";
import { User } from "@/lib/types";

export default async function UsersPage() {
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

  // --- PERBAIKAN DI SINI ---
  // Buat client khusus untuk aksi admin menggunakan service_role key
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  // Ambil data dari tabel 'users'
  const { data: profiles, error: profileError } = await supabase
    .from("users")
    .select(`id, full_name, role`);

  // Ambil data dari tabel 'auth.users' menggunakan client admin
  const { data: authUsers, error: authError } =
    await supabaseAdmin.auth.admin.listUsers();

  if (profileError || authError) {
    console.error("Error fetching users:", profileError || authError);
    return <p className="p-6">Gagal memuat data pengguna.</p>;
  }

  // Gabungkan data profil dan data auth berdasarkan ID
  const users: User[] = profiles.map((profile) => {
    const authUser = authUsers.users.find((u) => u.id === profile.id);
    return {
      ...profile,
      email: authUser?.email || "N/A",
    };
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <Table>
          <TableCaption>
            Daftar semua pengguna yang terdaftar di sistem.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || "Tanpa Nama"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin" ? "destructive" : "secondary"
                    }
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} currentUserId={currentUserId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
