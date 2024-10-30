'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteCategory } from '@/features/categories/components/delete-category';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

interface Props {
  id: string;
  name: string;
}

export const Actions = ({ id, name }: Props) => {
  const { onOpen } = useOpenCategory();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem disabled={false} onSelect={() => onOpen(id)}>
            <Edit className='size-4 mr-2' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            <Trash className='size-4 mr-2' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Conformation Modal for deleting category */}
      <DeleteCategory
        open={isOpen}
        onOpenChange={setIsOpen}
        name={name}
        id={id}
      />
    </>
  );
};

// 4:46:14
