// components/shared/AddCostDialog.tsx
"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { addCostAction } from "@/app/actions";

export function AddCostDialog({ equipmentId }: { equipmentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const addActionWithId = addCostAction.bind(null, equipmentId);

  const handleFormSubmit = async (formData: FormData) => {
    const result = await addActionWithId(formData);
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
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Biaya
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Catatan Biaya</DialogTitle>
          <DialogDescription>
            Isi detail biaya operasional baru.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Contoh: Servis rutin bulanan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_type">Jenis Biaya</Label>
              <Select name="cost_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis biaya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Servis">Servis</SelectItem>
                  <SelectItem value="Suku Cadang">Suku Cadang</SelectItem>
                  <SelectItem value="Bahan Bakar">Bahan Bakar</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="50000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                <Input
                  id="transaction_date"
                  name="transaction_date"
                  type="date"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
