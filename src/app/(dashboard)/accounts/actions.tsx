'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { Edit, MoreHorizontal } from 'lucide-react';

interface Props {
  id: string;
}

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// 4:46:14
