import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Item {
  id: number;
  code: string;
  name: string;
  qty: number;
  reorder_level: number;
  expiry_days: number | null;
  location: string;
}

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: Item) => void;
  item: Item | null;
}

export function EditItemDialog({
  isOpen,
  onClose,
  onConfirm,
  item,
}: EditItemDialogProps) {
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    }
  }, [item]);

  if (!editedItem) return null;

  const handleConfirm = () => {
    onConfirm(editedItem);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Item</AlertDialogTitle>
          <AlertDialogDescription>Update item details</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reorder" className="text-right">Reorder Level</Label>
            <Input
              id="reorder"
              type="number"
              value={editedItem.reorder_level}
              onChange={(e) => setEditedItem({...editedItem, reorder_level: parseInt(e.target.value) || 0})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">Expiry Days</Label>
            <Input
              id="expiry"
              type="number"
              value={editedItem.expiry_days || ''}
              onChange={(e) => setEditedItem({...editedItem, expiry_days: e.target.value ? parseInt(e.target.value) : null})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input
              id="location"
              value={editedItem.location}
              onChange={(e) => setEditedItem({...editedItem, location: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}