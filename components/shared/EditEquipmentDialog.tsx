// components/shared/EditEquipmentDialog.tsx
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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Equipment } from "@/lib/types";
import { editEquipmentAction } from "@/app/actions";

interface EditEquipmentDialogProps {
  equipment: Equipment;
}

export function EditEquipmentDialog({ equipment }: EditEquipmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Kita bind action dengan equipment.id
  const editEquipmentActionWithId = editEquipmentAction.bind(
    null,
    equipment.id
  );

  const handleFormSubmit = async (formData: FormData) => {
    const result = await editEquipmentActionWithId(formData);

    if (result?.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", {
        description: "Data peralatan telah diperbarui.",
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center w-full cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Data Peralatan</DialogTitle>
          <DialogDescription>
            Ubah detail peralatan di bawah ini. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={equipment.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <Select
                name="category"
                defaultValue={equipment.category}
                required
              >
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
              <Select
                name="condition"
                defaultValue={equipment.condition}
                required
              >
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
              <Input
                id="brand"
                name="brand"
                defaultValue={equipment.brand || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase_year" className="text-right">
                Tahun Beli
              </Label>
              <Input
                id="purchase_year"
                name="purchase_year"
                type="number"
                defaultValue={equipment.purchase_year || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
