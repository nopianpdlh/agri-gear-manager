// components/shared/MaintenanceExportActions.tsx
"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface MaintenanceExportActionsProps {
  data: any[];
}

export function MaintenanceExportActions({
  data,
}: MaintenanceExportActionsProps) {
  const handleExportExcel = () => {
    const formattedData = data.map((item) => ({
      Peralatan: item.equipment.name,
      "Tanggal Jatuh Tempo": format(new Date(item.due_date), "d MMMM yyyy", {
        locale: id,
      }),
      Deskripsi: item.description,
      Status: item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.writeFile(XLSX.utils.book_new(), "Jadwal_Perawatan.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Laporan Jadwal Perawatan", 14, 16);
    const tableColumn = ["Peralatan", "Jatuh Tempo", "Deskripsi", "Status"];
    const tableRows = data.map((item) => [
      item.equipment.name,
      format(new Date(item.due_date), "d MMM yyyy", { locale: id }),
      item.description || "-",
      item.status,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("Laporan_Jadwal_Perawatan.pdf");
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
