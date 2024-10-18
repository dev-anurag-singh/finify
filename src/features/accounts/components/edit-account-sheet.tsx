'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { insertAccountSchema } from '@/db/schema';
import AccountForm from './account-form';
import { z } from 'zod';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { useGetAccount } from '../api/use-get-account';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  const { data, isLoading } = useGetAccount(id);
  const { mutate, isPending } = useEditAccount(id);

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => onClose(),
    });
  };

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
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={data}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default EditAccountSheet;
