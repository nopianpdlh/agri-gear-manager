// components/shared/ExportPdfButton.tsx
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- PERUBAHAN 1
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Equipment } from "@/lib/types";

// Deklarasi tipe tidak lagi diperlukan karena kita mengimpor langsung

interface ExportPdfButtonProps {
  data: Equipment[];
  filename: string;
}

export function ExportPdfButton({ data, filename }: ExportPdfButtonProps) {
  const handleExport = () => {
    const doc = new jsPDF();

    // 1. Menambahkan Judul Dokumen
    doc.text("Laporan Inventaris Peralatan", 14, 16);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 22);

    // 2. Menyiapkan data untuk tabel
    const tableColumn = [
      "Nama Peralatan",
      "Kategori",
      "Kondisi",
      "Status",
      "Tahun Beli",
    ];
    const tableRows: any[] = [];

    data.forEach((item) => {
      const ticketData = [
        item.name,
        item.category,
        item.condition,
        item.status,
        item.purchase_year || "-",
      ];
      tableRows.push(ticketData);
    });

    // 3. Membuat tabel menggunakan autoTable
    autoTable(doc, {
      // <-- PERUBAHAN 2
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Posisi awal tabel
    });

    // 4. Menyimpan file PDF
    doc.save(`${filename}.pdf`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileText className="mr-2 h-4 w-4" />
      Cetak PDF
    </Button>
  );
}
