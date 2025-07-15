// components/shared/BorrowEquipmentDialog.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
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
import { toast } from "sonner";
import { Equipment } from "@/lib/types";
import { requestToBorrowAction } from "@/app/actions";
import { cn } from "@/lib/utils";

interface BorrowEquipmentDialogProps {
  equipment: Equipment;
}

export function BorrowEquipmentDialog({
  equipment,
}: BorrowEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const borrowActionWithId = requestToBorrowAction.bind(null, equipment.id);

  const handleFormSubmit = async (formData: FormData) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Rentang tanggal wajib diisi!");
      return;
    }
    formData.set("start_date", dateRange.from.toISOString());
    formData.set("end_date", dateRange.to.toISOString());

    const result = await borrowActionWithId(formData);

    if (result?.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Ajukan Peminjaman</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pinjam: {equipment.name}</DialogTitle>
          <DialogDescription>
            Pilih rentang tanggal peminjaman. Permintaan Anda akan ditinjau oleh
            Admin.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_range" className="text-right">
                Tanggal
              </Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    id="date_range"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: id })}{" "}
                          - {format(dateRange.to, "LLL dd, y", { locale: id })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: id })
                      )
                    ) : (
                      <span>Pilih rentang tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Kirim Permintaan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
