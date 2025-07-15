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
};
