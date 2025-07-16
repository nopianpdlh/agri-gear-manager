// components/shared/EquipmentExportActions.tsx
"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { Equipment } from "@/lib/types";

interface ExportActionsProps {
  data: Equipment[];
}

export function EquipmentExportActions({ data }: ExportActionsProps) {
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      "Nama Peralatan": item.name,
      Merk: item.brand,
      Model: item.model,
      Kategori: item.category,
      Kondisi: item.condition,
      Status: item.status,
      "Tahun Beli": item.purchase_year,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peralatan");
    XLSX.writeFile(workbook, "Daftar_Peralatan.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Inventaris Peralatan", 14, 16);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 22);

    const tableColumn = [
      "Nama Peralatan",
      "Kategori",
      "Kondisi",
      "Status",
      "Tahun Beli",
    ];
    const tableRows = data.map((item) => [
      item.name,
      item.category,
      item.condition,
      item.status,
      item.purchase_year || "-",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("Laporan_Peralatan.pdf");
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExportExcel}>
        <FileDown className="mr-2 h-4 w-4" />
        Ekspor Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPdf}>
        <FileText className="mr-2 h-4 w-4" />
        Cetak PDF
      </Button>
    </div>
  );
}
