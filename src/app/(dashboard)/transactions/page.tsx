'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useDeleteTransactions } from '@/features/transactions/api/use-delete-transactions';
import { useState } from 'react';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { transactions } from '@/db/schema';
import { useCreateTransactions } from '@/features/transactions/api/use-create-transactions';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

function TransactionPage() {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importedResults, setImportedResults] = useState(
    INITIAL_IMPORT_RESULTS
  );

  const { onOpen } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const { mutate: deleteTransactions, isPending } = useDeleteTransactions();
  const { mutate: createTransactions, isPending: creatingTransactions } =
    useCreateTransactions();

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportedResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportedResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = (values: (typeof transactions.$inferInsert)[]) => {
    createTransactions(values, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ImportCard
          data={importedResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className='container px-0 pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transaction History
          </CardTitle>
          <div className='flex flex-col lg:flex-row items-center gap-4'>
            <Button
              disabled={isLoading || isPending}
              onClick={onOpen}
              size='sm'
              className='w-full lg:w-auto'
            >
              <Plus className='size-4 mr-2' />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
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
                deleteTransactions(
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
