// components/shared/AddEquipmentDialog.tsx
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
import { PlusCircle } from "lucide-react";
import { toast } from "sonner"; // Import toast dari sonner
import { addEquipmentAction } from "@/app/actions";

export function AddEquipmentDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    const result = await addEquipmentAction(formData);

    if (result?.error) {
      toast.error("Gagal!", {
        description: result.error,
      });
    } else {
      toast.success("Berhasil!", {
        description: "Peralatan baru telah ditambahkan.",
      });
      setIsOpen(false); // Tutup dialog setelah berhasil
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Peralatan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Peralatan Baru</DialogTitle>
          <DialogDescription>
            Isi detail peralatan di bawah ini. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <Select name="category" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alat Berat">Alat Berat</SelectItem>
                  <SelectItem value="Mesin">Mesin</SelectItem>
                  <SelectItem value="Alat Tangan">Alat Tangan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="condition" className="text-right">
                Kondisi
              </Label>
              <Select name="condition" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih kondisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="Perlu Perbaikan">
                    Perlu Perbaikan
                  </SelectItem>
                  <SelectItem value="Rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Merk
              </Label>
              <Input id="brand" name="brand" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase_year" className="text-right">
                Tahun Beli
              </Label>
              <Input
                id="purchase_year"
                name="purchase_year"
                type="number"
                className="col-span-3"
              />
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
