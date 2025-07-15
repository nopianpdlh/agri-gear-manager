// components/shared/MaintenanceActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  completeMaintenanceAction,
  cancelMaintenanceAction,
} from "@/app/actions";

interface MaintenanceActionsProps {
  schedule: {
    id: string;
    status: string;
    equipment: {
      id: string;
    };
  };
}

export function MaintenanceActions({ schedule }: MaintenanceActionsProps) {
  if (schedule.status !== "Dijadwalkan") {
    return null; // Jangan tampilkan aksi jika sudah selesai atau dibatalkan
  }

  const handleComplete = async () => {
    toast.info("Memperbarui status...");
    const result = await completeMaintenanceAction(
      schedule.id,
      schedule.equipment.id
    );
    if (result.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
    }
  };

  const handleCancel = async () => {
    toast.info("Memperbarui status...");
    const result = await cancelMaintenanceAction(
      schedule.id,
      schedule.equipment.id
    );
    if (result.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button size="sm" onClick={handleComplete}>
        Tandai Selesai
      </Button>
      <Button size="sm" variant="outline" onClick={handleCancel}>
        Batalkan
      </Button>
    </div>
  );
}
