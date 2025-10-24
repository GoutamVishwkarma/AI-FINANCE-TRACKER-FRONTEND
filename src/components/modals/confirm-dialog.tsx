'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700',
    },
    warning: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
  };

  const style = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className={`w-14 h-14 rounded-2xl ${style.bg} border-2 ${style.border} flex items-center justify-center mb-4`}>
          <AlertTriangle className={`w-7 h-7 ${style.icon}`} />
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 border-2 border-slate-200 hover:bg-slate-50 rounded-lg font-semibold"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-11 ${style.button} text-white font-semibold rounded-lg shadow-lg`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
