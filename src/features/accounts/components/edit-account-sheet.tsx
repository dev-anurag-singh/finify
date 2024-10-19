'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import AccountForm from './account-form';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { useGetAccount } from '../api/use-get-account';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';
import { useDeleteAccount } from '../api/use-delete-account';

function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data, isLoading } = useGetAccount(id);
  const { mutate, isPending } = useEditAccount(id);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount(id);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Edit your account name</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <Skeleton className='h-10 rounded-md mt-10' />
        ) : (
          <AccountForm
            id={id}
            onSubmit={values => {
              mutate(values, {
                onSuccess: onClose,
              });
            }}
            onDelete={() => {
              deleteAccount(undefined, { onSuccess: onClose });
            }}
            disabled={isPending || isDeleting}
            defaultValues={data}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default EditAccountSheet;
