import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { cn } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen } = useOpenCategory();
  const { onOpen: openTransaction } = useOpenTransaction();

  const onClick = () => {
    if (!categoryId) {
      openTransaction(id);
    } else {
      onOpen(categoryId);
    }
  };

  return (
    <div
      className={cn('flex items-center cursor-pointer hover:underline', {
        'text-rose-500': !category,
      })}
      onClick={onClick}
    >
      {!category && <TriangleAlert className='mr-2 size-4 shrink-0' />}
      {category || 'Uncategorized'}
    </div>
  );
};
