'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNewCategory } from '../hooks/use-new-category';
import CategoryForm from './category-form';
import { useCreateCategory } from '../api/use-create-category';

function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();
  const { mutate, isPending } = useCreateCategory();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='space-y-4'>
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
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

export default NewCategorySheet;
