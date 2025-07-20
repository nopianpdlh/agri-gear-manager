// components/shared/CostExportActions.tsx
"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";

interface CostExportActionsProps {
  data: any[];
  equipmentName: string;
}

export function CostExportActions({
  data,
  equipmentName,
}: CostExportActionsProps) {
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      Tanggal: new Date(item.transaction_date).toLocaleDateString("id-ID"),
      Deskripsi: item.description,
      "Jenis Biaya": item.cost_type,
      "Jumlah (Rp)": item.amount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Biaya");
    XLSX.writeFile(workbook, `Biaya_${equipmentName.replace(/ /g, "_")}.xlsx`);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text(`Laporan Biaya Operasional untuk ${equipmentName}`, 14, 16);
    const tableColumn = ["Tanggal", "Deskripsi", "Jenis Biaya", "Jumlah (Rp)"];
    const tableRows = data.map((item) => [
      new Date(item.transaction_date).toLocaleDateString("id-ID"),
      item.description,
      item.cost_type,
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(item.amount),
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save(`Laporan_Biaya_${equipmentName.replace(/ /g, "_")}.pdf`);
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
