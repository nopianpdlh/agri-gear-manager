// app/actions.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

export async function addEquipmentAction(formData: FormData) {
  const cookieStore = await cookies(); // Dihapus 'await' dari sini

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          // Kembali menggunakan .set dengan nilai kosong, ini adalah cara yang paling pasti dan benar
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login untuk menambah peralatan." };

  const rawFormData = {
    name: formData.get("name") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    purchase_year: Number(formData.get("purchase_year")) || null,
    category: formData.get("category") as string,
    condition: formData.get("condition") as string,
    owner_id: user.id,
  };

  if (!rawFormData.name || !rawFormData.category || !rawFormData.condition) {
    return { error: "Nama, Kategori, dan Kondisi wajib diisi." };
  }

  const { error } = await supabase.from("equipment").insert([rawFormData]);
  if (error) {
    console.error("Supabase error:", error);
    return { error: "Gagal menambahkan data ke database." };
  }

  revalidatePath("/equipment");
  return { success: "Peralatan berhasil ditambahkan!" };
}
