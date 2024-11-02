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
import { useDeleteCategory } from '../api/use-delete-category';

interface Props {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
  closeSheet?: () => void;
}

export const DeleteCategory = ({
  open,
  onOpenChange,
  name,
  id,
  closeSheet,
}: Props) => {
  const { mutate, isPending } = useDeleteCategory(id);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this category?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the {name} category? This action
            will remove all the data and cannot be reversed.
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
