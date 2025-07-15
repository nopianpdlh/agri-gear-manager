// components/shared/RequestActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  approveBorrowRequestAction,
  rejectBorrowRequestAction,
  returnEquipmentAction,
} from "@/app/actions";

interface RequestActionsProps {
  request: {
    id: string;
    status: string;
    equipment_id: string; // Menggunakan equipment_id dari view
    user_id: string;
    start_date: string;
  };
}

export function RequestActions({ request }: RequestActionsProps) {
  // Hanya tampilkan tombol jika status masih 'Tertunda'
  if (request.status === "Tertunda") {
    const handleApprove = async () => {
      toast.info("Menyetujui permintaan...");
      // Menggunakan equipment_id langsung dari properti request
      const result = await approveBorrowRequestAction(
        request.id,
        request.equipment_id
      );
      if (result.error) {
        toast.error("Gagal!", { description: result.error });
      } else {
        toast.success("Berhasil!", { description: result.success });
      }
    };
    const handleReject = async () => {
      toast.info("Menolak permintaan...");
      const result = await rejectBorrowRequestAction(request.id);
      if (result.error) {
        toast.error("Gagal!", { description: result.error });
      } else {
        toast.success("Berhasil!", { description: result.success });
      }
    };
    return (
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={handleReject}>
          Tolak
        </Button>
        <Button size="sm" onClick={handleApprove}>
          Setujui
        </Button>
      </div>
    );
  }

  if (request.status === "Disetujui") {
    const handleReturn = async () => {
      toast.info("Memproses pengembalian...");
      const result = await returnEquipmentAction(request);
      if (result.error) {
        toast.error("Gagal!", { description: result.error });
      } else {
        toast.success("Berhasil!", { description: result.success });
      }
    };
    return (
      <Button size="sm" onClick={handleReturn}>
        Tandai Dikembalikan
      </Button>
    );
  }

  // Tampilkan teks jika sudah selesai atau ditolak
  return <span className="text-sm text-gray-500">Tindakan Selesai</span>;
}
