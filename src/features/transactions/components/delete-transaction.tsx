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
import { Dispatch, SetStateAction } from 'react';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id: string;
  closeSheet?: () => void;
}

export const DeleteTransaction = ({
  open,
  onOpenChange,
  id,
  closeSheet,
}: Props) => {
  const { mutate, isPending } = useDeleteTransaction(id);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this Transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this transaction? This action will
            delete the transaction and cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={() => {
              mutate(undefined, {
                onSuccess: () => {
                  onOpenChange(false);
                  closeSheet?.();
                },
              });
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
