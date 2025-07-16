// lib/types.ts
export type Equipment = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  purchase_year: number | null;
  condition: "Baik" | "Perlu Perbaikan" | "Rusak";
  category: "Alat Berat" | "Mesin" | "Alat Tangan";
  created_at: string;
  status: "Tersedia" | "Dipinjam" | "Dalam Perawatan";
  photo_urls: string[] | null;
};

export type SparePart = {
  id: string;
  equipment_id: string;
  name: string;
  specification: string | null;
  stock: number;
  stock_threshold: number;
};
export type User = {
  id: string;
  full_name: string | null;
  email: string | null; // Email didapat dari tabel auth, jadi kita tambahkan secara manual
  role: "admin" | "member";
};
