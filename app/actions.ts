// app/actions.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

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

  const { error } = await supabase
    .from("equipment")
    .update(rawFormData)
    .eq("id", equipmentId);

  if (error) {
    console.error("Supabase update error:", error);
    return { error: "Gagal memperbarui data di database." };
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
