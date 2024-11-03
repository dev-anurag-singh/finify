'use client';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import CategoryForm from './category-form';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useGetCategory } from '../api/use-get-category';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { DeleteCategory } from './delete-category';

function EditCategorySheet() {
  const { isOpen, onClose, id } = useOpenCategory();
  const { data, isLoading } = useGetCategory(id);
  const { mutate, isPending } = useEditCategory(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit your category name</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <Skeleton className='h-10 rounded-md mt-10' />
          ) : (
            <CategoryForm
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
      {/* Delete Category Modal */}
      <DeleteCategory
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        closeSheet={onClose}
        id={data?.id!}
        name={data?.name!}
      />
    </>
  );
}

export default EditCategorySheet;
