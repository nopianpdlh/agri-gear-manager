// components/shared/SparePartActions.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { toast } from "sonner";
import { editSparePartAction, deleteSparePartAction } from "@/app/actions";
import { SparePart } from "@/lib/types"; // Impor tipe data

interface SparePartActionsProps {
  part: SparePart;
}

export function SparePartActions({ part }: SparePartActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const editActionWithId = editSparePartAction.bind(
    null,
    part.id,
    part.equipment_id
  );
  const deleteActionWithId = deleteSparePartAction.bind(
    null,
    part.id,
    part.equipment_id
  );

  const handleEditSubmit = async (formData: FormData) => {
    const result = await editActionWithId(formData);
    if (result.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    const result = await deleteActionWithId();
    if (result.error) {
      toast.error("Gagal!", { description: result.error });
    } else {
      toast.success("Berhasil!", { description: result.success });
    }
  };

  return (
    <AlertDialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog untuk Edit */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Suku Cadang</DialogTitle>
            <DialogDescription>Perbarui detail suku cadang.</DialogDescription>
          </DialogHeader>
          <form action={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Suku Cadang</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={part.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specification">Spesifikasi</Label>
                <Input
                  id="specification"
                  name="specification"
                  defaultValue={part.specification || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Jumlah Stok</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={part.stock}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_threshold">Batas Stok Min.</Label>
                  <Input
                    id="stock_threshold"
                    name="stock_threshold"
                    type="number"
                    defaultValue={part.stock_threshold}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi untuk Hapus */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus suku cadang secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
