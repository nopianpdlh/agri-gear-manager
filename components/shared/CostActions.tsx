// components/shared/CostActions.tsx
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
import { toast } from "sonner";
import { editCostAction, deleteCostAction } from "@/app/actions";

type Cost = {
  id: string;
  description: string;
  cost_type: string;
  amount: number;
  transaction_date: string;
};

interface CostActionsProps {
  cost: Cost;
  equipmentId: string;
}

export function CostActions({ cost, equipmentId }: CostActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const editActionWithId = editCostAction.bind(null, cost.id, equipmentId);
  const deleteActionWithId = deleteCostAction.bind(null, cost.id, equipmentId);

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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Catatan Biaya</DialogTitle>
          </DialogHeader>
          <form action={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={cost.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_type">Jenis Biaya</Label>
                <Select name="cost_type" defaultValue={cost.cost_type} required>
                  <SelectTrigger>
                    <SelectValue />
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
                    defaultValue={cost.amount}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction_date">Tanggal Transaksi</Label>
                  <Input
                    id="transaction_date"
                    name="transaction_date"
                    type="date"
                    defaultValue={cost.transaction_date.split("T")[0]}
                    required
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

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
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
