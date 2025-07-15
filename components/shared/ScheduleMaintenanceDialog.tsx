// components/shared/ScheduleMaintenanceDialog.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Equipment } from "@/lib/types";
import { scheduleMaintenanceAction } from "@/app/actions";
import { cn } from "@/lib/utils";

interface ScheduleMaintenanceDialogProps {
  equipment: Equipment;
}

export function ScheduleMaintenanceDialog({
  equipment,
}: ScheduleMaintenanceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const scheduleActionWithId = scheduleMaintenanceAction.bind(
    null,
    equipment.id
  );

  const handleFormSubmit = async (formData: FormData) => {
    if (!date) {
      toast.error("Tanggal wajib diisi!");
      return;
    }
    formData.set("due_date", date.toISOString());

    const result = await scheduleActionWithId(formData);

    if (result?.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", {
        description: "Jadwal perawatan telah ditambahkan.",
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center w-full cursor-pointer p-2">
          <Wrench className="mr-2 h-4 w-4" />
          <span>Jadwalkan Perawatan</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Jadwalkan Perawatan</DialogTitle>
          <DialogDescription>
            Pilih tanggal dan isi deskripsi untuk perawatan{" "}
            <span className="font-semibold">{equipment.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due_date" className="text-right">
                Tanggal
              </Label>

              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Deskripsi
              </Label>

              <Textarea
                id="description"
                name="description"
                placeholder="Contoh: Ganti oli, periksa busi, dll."
                className="col-span-3"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Jadwalkan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
