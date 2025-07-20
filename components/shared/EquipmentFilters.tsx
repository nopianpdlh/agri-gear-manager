// components/shared/EquipmentFilters.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";

export function EquipmentFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (
    type: "category" | "condition",
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Debounce 300ms

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Cari berdasarkan nama peralatan..."
        className="md:col-span-1"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <Select
        onValueChange={(value) => handleFilterChange("category", value)}
        defaultValue={searchParams.get("category") || "all"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter berdasarkan kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem value="Alat Berat">Alat Berat</SelectItem>
          <SelectItem value="Mesin">Mesin</SelectItem>
          <SelectItem value="Alat Tangan">Alat Tangan</SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => handleFilterChange("condition", value)}
        defaultValue={searchParams.get("condition") || "all"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter berdasarkan kondisi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kondisi</SelectItem>
          <SelectItem value="Baik">Baik</SelectItem>
          <SelectItem value="Perlu Perbaikan">Perlu Perbaikan</SelectItem>
          <SelectItem value="Rusak">Rusak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
