// components/shared/AddSparePartDialog.tsx
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
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { addSparePartAction } from "@/app/actions";

export function AddSparePartDialog({ equipmentId }: { equipmentId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const addActionWithId = addSparePartAction.bind(null, equipmentId);

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
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Suku Cadang</DialogTitle>
          <DialogDescription>Isi detail suku cadang baru.</DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Suku Cadang</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specification">Spesifikasi</Label>
              <Input
                id="specification"
                name="specification"
                placeholder="Contoh: Ukuran 12mm, Tipe Busi X"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Jumlah Stok</Label>
                <Input id="stock" name="stock" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_threshold">Batas Stok Min.</Label>
                <Input
                  id="stock_threshold"
                  name="stock_threshold"
                  type="number"
                  defaultValue="1"
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
