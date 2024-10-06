import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  onConfirm: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function ConfirmDialog({
  onConfirm,
  isOpen,
  setIsOpen,
  disabled,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete your data.',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>
          <Button
            disabled={disabled}
            variant={'destructive'}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
