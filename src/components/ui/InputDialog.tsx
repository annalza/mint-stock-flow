import { useState } from "react";
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

interface InputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  title: string;
  description: string;
  label: string;
  defaultValue?: number;
  confirmText?: string;
  cancelText?: string;
}

export function InputDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  label,
  defaultValue = 1,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  const handleClose = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              {label}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 1)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}