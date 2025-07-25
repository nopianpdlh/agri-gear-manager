// app/actions.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export async function addEquipmentAction(formData: FormData) {
  const cookieStore = await cookies();

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

  const imageFile = formData.get("photo") as File;
  let photoUrl = null;

  if (!rawFormData.name || !rawFormData.category || !rawFormData.condition) {
    return { error: "Nama, Kategori, dan Kondisi wajib diisi." };
  }
  // Cek jika ada file yang diunggah
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("equipment-photos")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Gagal mengunggah foto." };
    }

    // Ambil URL publik dari file yang baru diunggah
    const { data: publicUrlData } = supabase.storage
      .from("equipment-photos")
      .getPublicUrl(fileName);

    photoUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("equipment").insert([
    {
      ...rawFormData,
      photo_urls: photoUrl ? [photoUrl] : null, // Simpan URL dalam array
    },
  ]);

  // Jika ada error saat menyimpan ke database

  if (error) {
    console.error("Supabase error:", error);
    return { error: "Gagal menambahkan data ke database." };
  }

  revalidatePath("/equipment");
  return { success: "Peralatan berhasil ditambahkan!" };
}

export async function deleteEquipmentAction(equipmentId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    // ... (konfigurasi supabase client sama seperti di addEquipmentAction)
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

  const { error } = await supabase
    .from("equipment")
    .delete()
    .match({ id: equipmentId });

  if (error) {
    console.error("Supabase delete error:", error);
    return { error: "Gagal menghapus peralatan." };
  }

  revalidatePath("/equipment");
  return { success: "Peralatan berhasil dihapus." };
}

export async function editEquipmentAction(
  equipmentId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
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
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login untuk mengubah data." };

  const rawFormData = {
    name: formData.get("name") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    purchase_year: Number(formData.get("purchase_year")) || null,
    category: formData.get("category") as string,
    condition: formData.get("condition") as string,
  };

  if (!rawFormData.name || !rawFormData.category || !rawFormData.condition) {
    return { error: "Nama, Kategori, dan Kondisi wajib diisi." };
  }

  const imageFile = formData.get("photo") as File;
  let photoUrl: string | null = null;

  const updateData: any = { ...rawFormData };

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("equipment-photos")
      .upload(fileName, imageFile);

    if (uploadError) return { error: "Gagal mengunggah foto baru." };

    const { data: publicUrlData } = supabase.storage
      .from("equipment-photos")
      .getPublicUrl(fileName);

    photoUrl = publicUrlData.publicUrl;
    updateData.photo_urls = [photoUrl];
  }

  const { error } = await supabase
    .from("equipment")
    .update(updateData)
    .eq("id", equipmentId);

  if (error) {
    console.error("Supabase update error:", error);
    return { error: "Gagal memperbarui data." };
  }

  revalidatePath("/equipment");
  return { success: "Data peralatan berhasil diperbarui!" };
}

export async function scheduleMaintenanceAction(
  equipmentId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    // ... (salin konfigurasi Supabase client dari fungsi lain)
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

  const rawFormData = {
    due_date: formData.get("due_date") as string,
    description: formData.get("description") as string,
  };

  if (!rawFormData.due_date) {
    return { error: "Tanggal perawatan wajib diisi." };
  }

  // 1. Insert jadwal baru ke tabel maintenance_schedules
  const { error: scheduleError } = await supabase
    .from("maintenance_schedules")
    .insert({
      equipment_id: equipmentId,
      due_date: format(new Date(rawFormData.due_date), "yyyy-MM-dd"),
      description: rawFormData.description,
    });

  if (scheduleError) {
    console.error("Supabase schedule error:", scheduleError);
    return { error: "Gagal menyimpan jadwal perawatan." };
  }

  // 2. Update status peralatan menjadi 'Dalam Perawatan'
  const { error: updateError } = await supabase
    .from("equipment")
    .update({ status: "Dalam Perawatan" })
    .eq("id", equipmentId);

  if (updateError) {
    console.error("Supabase update status error:", updateError);
    // Meskipun jadwal berhasil, kita beri tahu user ada masalah saat update status
    return { error: "Jadwal tersimpan, namun gagal update status alat." };
  }

  revalidatePath("/equipment");
  // Nantinya kita juga akan revalidate halaman /maintenance
  // revalidatePath('/maintenance');
  return { success: "Perawatan berhasil dijadwalkan!" };
}

async function updateMaintenanceAndEquipmentStatus(
  scheduleId: string,
  equipmentId: string,
  maintenanceStatus: "Selesai" | "Dibatalkan",
  equipmentStatus: "Tersedia"
) {
  const cookieStore = await cookies();
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

  // 1. Update status jadwal perawatan
  const { error: maintenanceError } = await supabase
    .from("maintenance_schedules")
    .update({ status: maintenanceStatus })
    .eq("id", scheduleId);

  if (maintenanceError) {
    console.error("Supabase maintenance update error:", maintenanceError);
    return { error: "Gagal memperbarui status jadwal." };
  }

  // 2. Update status peralatan kembali menjadi 'Tersedia'
  const { error: equipmentError } = await supabase
    .from("equipment")
    .update({ status: equipmentStatus })
    .eq("id", equipmentId);

  if (equipmentError) {
    console.error("Supabase equipment update error:", equipmentError);
    return { error: "Gagal memperbarui status peralatan." };
  }

  revalidatePath("/maintenance");
  revalidatePath("/equipment");
  return { success: `Perawatan telah ditandai sebagai ${maintenanceStatus}.` };
}

export async function completeMaintenanceAction(
  scheduleId: string,
  equipmentId: string
) {
  return updateMaintenanceAndEquipmentStatus(
    scheduleId,
    equipmentId,
    "Selesai",
    "Tersedia"
  );
}

export async function cancelMaintenanceAction(
  scheduleId: string,
  equipmentId: string
) {
  return updateMaintenanceAndEquipmentStatus(
    scheduleId,
    equipmentId,
    "Dibatalkan",
    "Tersedia"
  );
}

export async function requestToBorrowAction(
  equipmentId: string,
  formData: FormData
) {
  const cookieStore = await cookies();
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
  if (!user) return { error: "Anda harus login untuk meminjam." };

  const rawFormData = {
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
  };

  if (!rawFormData.start_date || !rawFormData.end_date) {
    return { error: "Tanggal mulai dan tanggal selesai wajib diisi." };
  }

  const { error } = await supabase.from("borrowing_requests").insert({
    equipment_id: equipmentId,
    user_id: user.id,
    start_date: new Date(rawFormData.start_date).toISOString(),
    end_date: new Date(rawFormData.end_date).toISOString(),
    status: "Tertunda", // Status awal adalah 'Tertunda' menunggu persetujuan
  });

  if (error) {
    console.error("Supabase borrow request error:", error);
    return { error: "Gagal mengajukan permintaan peminjaman." };
  }

  revalidatePath("/borrowing");
  return {
    success: "Permintaan peminjaman berhasil diajukan! Menunggu persetujuan.",
  };
}

export async function approveBorrowRequestAction(
  requestId: string,
  equipmentId: string
) {
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

  // 1. Update status permintaan menjadi 'Disetujui'
  const { error: requestError } = await supabase
    .from("borrowing_requests")
    .update({ status: "Disetujui" })
    .eq("id", requestId);

  if (requestError) {
    return { error: "Gagal menyetujui permintaan." };
  }

  // 2. Update status alat menjadi 'Dipinjam'
  const { error: equipmentError } = await supabase
    .from("equipment")
    .update({ status: "Dipinjam" })
    .eq("id", equipmentId);

  if (equipmentError) {
    // Jika gagal update alat, kembalikan status permintaan (opsional)
    return { error: "Gagal memperbarui status peralatan." };
  }

  revalidatePath("/requests");
  revalidatePath("/borrowing"); // Revalidasi halaman pinjam agar alat tidak muncul lagi
  return { success: "Permintaan telah disetujui." };
}

export async function rejectBorrowRequestAction(requestId: string) {
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

  const { error } = await supabase
    .from("borrowing_requests")
    .update({ status: "Ditolak" })
    .eq("id", requestId);

  if (error) {
    return { error: "Gagal menolak permintaan." };
  }

  revalidatePath("/requests");
  return { success: "Permintaan telah ditolak." };
}

export async function returnEquipmentAction(request: {
  id: string;
  equipment_id: string;
  user_id: string;
  start_date: string;
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

  // 1. Update status permintaan menjadi 'Dikembalikan'
  const { error: requestError } = await supabase
    .from("borrowing_requests")
    .update({ status: "Dikembalikan" })
    .eq("id", request.id);

  if (requestError) return { error: "Gagal memperbarui status permintaan." };

  // 2. Update status alat menjadi 'Tersedia'
  const { error: equipmentError } = await supabase
    .from("equipment")
    .update({ status: "Tersedia" })
    .eq("id", request.equipment_id);

  if (equipmentError) return { error: "Gagal memperbarui status peralatan." };

  // 3. Catat ke riwayat penggunaan
  const { error: historyError } = await supabase.from("usage_history").insert({
    equipment_id: request.equipment_id,
    user_id: request.user_id,
    borrow_request_id: request.id,
    start_date: request.start_date,
    return_date: new Date().toISOString(),
  });

  if (historyError) return { error: "Gagal mencatat riwayat penggunaan." };

  revalidatePath("/requests");
  revalidatePath("/equipment");
  return { success: "Peralatan telah ditandai sebagai dikembalikan." };
}

export async function signUpAction(formData: FormData) {
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

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  // Ambil semua data baru dari form
  const data = {
    full_name: fullName,
    phone_number: formData.get("phone_number") as string,
    farm_name: formData.get("farm_name") as string,
    commodity_type: formData.get("commodity_type") as string,
    land_area: formData.get("land_area") as string,
    province: formData.get("province") as string,
    city: formData.get("city") as string,
    full_address: formData.get("full_address") as string,
    postal_code: formData.get("postal_code") as string,
  };

  if (!email || !password || !fullName) {
    return { error: "Informasi akun wajib diisi." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Teruskan semua data tambahan yang akan ditangkap oleh trigger
      data: data,
    },
  });

  if (error) {
    console.error("Sign up error:", error);
    return { error: "Gagal mendaftarkan akun. Email mungkin sudah terdaftar." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signInWithGoogleAction() {
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Pastikan URL ini sudah ditambahkan di Google Cloud Console
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: "Gagal login dengan Google. Coba lagi." };
  }

  // Redirect terjadi di sisi klien, jadi kita kirim URL-nya
  return { url: data.url };
}
export async function loginAction(formData: FormData) {
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Email atau kata sandi salah." };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// Action baru untuk lupa password
export async function forgotPasswordAction(email: string) {
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
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
  });
  if (error) {
    return { error: "Gagal mengirim email reset. Pastikan email benar." };
  }
  return { success: true };
}

// Action baru untuk update password
export async function updateUserPasswordAction(password: string) {
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
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error: "Gagal memperbarui kata sandi. Link mungkin sudah kedaluwarsa.",
    };
  }
  return { success: true };
}
export async function addSparePartAction(
  equipmentId: string,
  formData: FormData
) {
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

  const rawFormData = {
    equipment_id: equipmentId,
    name: formData.get("name") as string,
    specification: formData.get("specification") as string,
    stock: Number(formData.get("stock")) || 0,
    stock_threshold: Number(formData.get("stock_threshold")) || 1,
  };

  if (!rawFormData.name) {
    return { error: "Nama suku cadang wajib diisi." };
  }

  const { error } = await supabase.from("spare_parts").insert([rawFormData]);
  if (error) {
    console.error("Spare part insert error:", error);
    return { error: "Gagal menambahkan suku cadang." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Suku cadang berhasil ditambahkan." };
}

export async function editSparePartAction(
  partId: string,
  equipmentId: string,
  formData: FormData
) {
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

  const rawFormData = {
    name: formData.get("name") as string,
    specification: formData.get("specification") as string,
    stock: Number(formData.get("stock")) || 0,
    stock_threshold: Number(formData.get("stock_threshold")) || 1,
  };

  if (!rawFormData.name) {
    return { error: "Nama suku cadang wajib diisi." };
  }

  const { error } = await supabase
    .from("spare_parts")
    .update(rawFormData)
    .eq("id", partId);

  if (error) {
    console.error("Spare part update error:", error);
    return { error: "Gagal memperbarui suku cadang." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Suku cadang berhasil diperbarui." };
}

export async function deleteSparePartAction(
  partId: string,
  equipmentId: string
) {
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

  const { error } = await supabase
    .from("spare_parts")
    .delete()
    .eq("id", partId);

  if (error) {
    console.error("Spare part delete error:", error);
    return { error: "Gagal menghapus suku cadang." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Suku cadang berhasil dihapus." };
}

export async function changeUserRoleAction(
  userId: string,
  newRole: "admin" | "member"
) {
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

  // Verifikasi bahwa pengguna yang melakukan aksi adalah admin
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: adminProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", session!.user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { error: "Hanya admin yang dapat mengubah peran." };
  }

  // Mencegah admin mengubah perannya sendiri
  if (session?.user?.id === userId) {
    return { error: "Anda tidak dapat mengubah peran Anda sendiri." };
  }

  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Change role error:", error);
    return { error: "Gagal mengubah peran pengguna." };
  }

  revalidatePath("/users");
  return { success: `Peran pengguna berhasil diubah menjadi ${newRole}.` };
}

export async function logoutAction() {
  const cookieStore = await cookies();
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
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    // Jika gagal, tetap arahkan ke halaman login untuk memastikan pengguna keluar
  }

  // Selalu arahkan pengguna ke halaman login setelah mencoba logout
  return redirect("/login");
}

export async function addCostAction(equipmentId: string, formData: FormData) {
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

  const rawFormData = {
    equipment_id: equipmentId,
    description: formData.get("description") as string,
    cost_type: formData.get("cost_type") as string,
    amount: Number(formData.get("amount")),
    transaction_date: formData.get("transaction_date") as string,
  };

  if (
    !rawFormData.description ||
    !rawFormData.cost_type ||
    !rawFormData.amount ||
    !rawFormData.transaction_date
  ) {
    return { error: "Semua kolom wajib diisi." };
  }

  const { error } = await supabase
    .from("operational_costs")
    .insert([rawFormData]);
  if (error) {
    console.error("Add cost error:", error);
    return { error: "Gagal menambahkan biaya." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Biaya berhasil ditambahkan." };
}

export async function editCostAction(
  costId: string,
  equipmentId: string,
  formData: FormData
) {
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

  const rawFormData = {
    description: formData.get("description") as string,
    cost_type: formData.get("cost_type") as string,
    amount: Number(formData.get("amount")),
    transaction_date: formData.get("transaction_date") as string,
  };

  if (
    !rawFormData.description ||
    !rawFormData.cost_type ||
    !rawFormData.amount ||
    !rawFormData.transaction_date
  ) {
    return { error: "Semua kolom wajib diisi." };
  }

  const { error } = await supabase
    .from("operational_costs")
    .update(rawFormData)
    .eq("id", costId);

  if (error) {
    console.error("Edit cost error:", error);
    return { error: "Gagal memperbarui biaya." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Biaya berhasil diperbarui." };
}

export async function deleteCostAction(costId: string, equipmentId: string) {
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

  const { error } = await supabase
    .from("operational_costs")
    .delete()
    .eq("id", costId);

  if (error) {
    console.error("Delete cost error:", error);
    return { error: "Gagal menghapus biaya." };
  }

  revalidatePath(`/equipment/${equipmentId}`);
  return { success: "Biaya berhasil dihapus." };
}
