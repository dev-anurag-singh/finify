'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useDeleteTransactions } from '@/features/transactions/api/use-delete-transactions';

function TransactionPage() {
  const { onOpen } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const { mutate: deleteAccounts, isPending } = useDeleteTransactions();

  return (
    <div className='container px-0 pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transaction History
          </CardTitle>
          <Button disabled={isLoading || isPending} onClick={onOpen} size='sm'>
            <Plus className='size-4 mr-2' />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='h-[400px] grid place-content-center'>
              <Loader2 className='size-6 animate-spin' />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data || []}
              filterKey='payee'
              onDelete={(row, fn) => {
                const ids = row.map(r => r.original.id);
                deleteAccounts(
                  { ids },
                  {
                    onSuccess: fn,
                  }
                );
              }}
              disabled={isLoading || isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionPage;
