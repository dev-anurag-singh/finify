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
import { useDeleteAccount } from '../api/use-delete-account';

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
  closeSheet?: () => void;
}

export const DeleteAccount = ({
  open,
  onOpenChange,
  name,
  id,
  closeSheet,
}: Props) => {
  const { mutate, isPending } = useDeleteAccount(id);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the {name} account? This action will
            remove all the data and cannot be reversed.
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
