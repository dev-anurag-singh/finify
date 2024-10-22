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
import { DeleteAccount } from './delete-account';
import { useState } from 'react';

function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data, isLoading } = useGetAccount(id);
  const { mutate, isPending } = useEditAccount(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
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
                // Open the confirmation dialog
                setConfirmOpen(true);
              }}
              disabled={isPending}
              defaultValues={data}
            />
          )}
        </SheetContent>
      </Sheet>
      {/* Delete Account Modal */}
      <DeleteAccount
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        closeSheet={onClose}
        id={data?.id!}
        name={data?.name!}
      />
    </>
  );
}

export default EditAccountSheet;
