// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Daftar rute yang hanya bisa diakses oleh admin
const adminRoutes = ["/requests", "/users"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          response.cookies.set(name, "", options);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika ada sesi, cek peran untuk rute admin
  if (
    session &&
    adminRoutes.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userProfile?.role !== "admin") {
      // Jika bukan admin, arahkan ke dashboard utama
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
