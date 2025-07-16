// components/shared/HistoryExportActions.tsx
"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface HistoryExportActionsProps {
  data: any[]; // Gunakan any untuk kemudahan, karena data ini dari view
}

export function HistoryExportActions({ data }: HistoryExportActionsProps) {
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      Peralatan: item.equipment_name,
      Peminjam: item.user_name,
      "Tanggal Pinjam": format(new Date(item.start_date), "d MMM yyyy, HH:mm", {
        locale: id,
      }),
      "Tanggal Kembali": format(
        new Date(item.return_date),
        "d MMM yyyy, HH:mm",
        { locale: id }
      ),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Penggunaan");
    XLSX.writeFile(workbook, "Riwayat_Penggunaan.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Riwayat Penggunaan", 14, 16);
    const tableColumn = [
      "Peralatan",
      "Peminjam",
      "Tanggal Pinjam",
      "Tanggal Kembali",
    ];
    const tableRows = data.map((item) => [
      item.equipment_name,
      item.user_name,
      format(new Date(item.start_date), "d MMM yyyy", { locale: id }),
      format(new Date(item.return_date), "d MMM yyyy", { locale: id }),
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("Laporan_Riwayat_Penggunaan.pdf");
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
