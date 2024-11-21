'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteTransaction } from '@/features/transactions/components/delete-transaction';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

interface Props {
  id: string;
}

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction();
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
      {/* Conformation Modal for deleting transaction */}
      <DeleteTransaction open={isOpen} onOpenChange={setIsOpen} id={id} />
    </>
  );
};

// 4:46:14
