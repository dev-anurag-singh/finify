'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNewAccount } from '../hooks/use-new-account';
import AccountForm from './account-form';
import { useCreateAccount } from '../api/use-create-accounts';

function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();
  const { mutate, isPending } = useCreateAccount();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={values => {
            mutate(values, {
              onSuccess: onClose,
            });
          }}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
