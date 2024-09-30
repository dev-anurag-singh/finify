'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { insertAccountSchema } from '@/db/schema';
import { useNewAccount } from '../hooks/use-new-account';
import AccountForm from './account-form';
import { useCreateAccount } from '../api/use-create-accounts';
import { z } from 'zod';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();
  const { mutate, isPending } = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => onClose(),
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm onSubmit={onSubmit} disabled={isPending} />
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;
