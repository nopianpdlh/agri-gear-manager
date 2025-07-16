// components/shared/ExportButton.tsx
"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Equipment } from "@/lib/types";

interface ExportButtonProps {
  data: Equipment[];
  filename: string;
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    // 1. Memformat data agar sesuai dengan kolom yang diinginkan
    const formattedData = data.map((item) => ({
      "Nama Peralatan": item.name,
      Merk: item.brand,
      Model: item.model,
      Kategori: item.category,
      Kondisi: item.condition,
      Status: item.status,
      "Tahun Beli": item.purchase_year,
    }));

    // 2. Membuat worksheet dari data yang sudah diformat
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 3. Membuat workbook baru dan menambahkan worksheet ke dalamnya
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peralatan");

    // 4. Menulis (mengunduh) file Excel
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileDown className="mr-2 h-4 w-4" />
      Ekspor ke Excel
    </Button>
  );
}
