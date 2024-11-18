'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNewTransaction } from '../hooks/use-new-transaction';
import { useCreateTransaction } from '../api/use-create-transaction';
import TransactionForm from './transaction-form';

function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();
  const { mutate, isPending } = useCreateTransaction();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>
        <TransactionForm
          onSubmit={values => mutate(values, { onSuccess: onClose })}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}

export default NewTransactionSheet;

// 6:34:46
