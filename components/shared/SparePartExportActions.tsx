// components/shared/SparePartExportActions.tsx
"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { SparePart } from "@/lib/types";

interface SparePartExportActionsProps {
  data: SparePart[];
  equipmentName: string;
}

export function SparePartExportActions({
  data,
  equipmentName,
}: SparePartExportActionsProps) {
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      "Nama Suku Cadang": item.name,
      Spesifikasi: item.specification,
      Stok: item.stock,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suku Cadang");
    XLSX.writeFile(
      workbook,
      `Suku_Cadang_${equipmentName.replace(/ /g, "_")}.xlsx`
    );
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text(`Laporan Suku Cadang untuk ${equipmentName}`, 14, 16);
    const tableColumn = ["Nama Suku Cadang", "Spesifikasi", "Stok"];
    const tableRows = data.map((item) => [
      item.name,
      item.specification || "-",
      item.stock,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save(`Laporan_Suku_Cadang_${equipmentName.replace(/ /g, "_")}.pdf`);
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
