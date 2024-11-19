'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import TransactionForm from '@/features/transactions/components/transaction-form';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { DeleteTransaction } from '@/features/transactions/components/delete-transaction';
import { useState } from 'react';

function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();
  const { data, isLoading } = useGetTransaction(id);
  const { mutate, isPending } = useEditTransaction(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const defaultValues = data && {
    ...data,
    date: new Date(data.date),
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit your Transaction detail</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <Skeleton className='h-10 rounded-md mt-10' />
          ) : (
            <TransactionForm
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
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
      {/* Delete Account Modal */}
      <DeleteTransaction
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        closeSheet={onClose}
        id={data?.id!}
      />
    </>
  );
}

export default EditTransactionSheet;
