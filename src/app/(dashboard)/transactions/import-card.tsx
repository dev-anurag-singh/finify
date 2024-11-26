import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { ImportTable } from './import-table';
import { convertAmountToMiliunits } from '@/lib/utils';
import { format, parse } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select } from '@/components/select';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = ['amount', 'date', 'payee'];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );
  const [selectedAccount, setSelectedAccount] = useState<string | null>();

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns(prev => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  // LOADING ACCOUNT OPTIONS
  const accountQuery = useGetAccounts();

  const { mutate: createAccount, isPending: creatingAccount } =
    useCreateAccount();

  const onCreateAccount = (name: string) => {
    createAccount({ name });
  };

  const accountOptions =
    accountQuery.data?.map(account => ({
      label: account.name,
      value: account.id,
    })) || [];

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleConfirm = () => {
    const mappedData: { [key: string]: string }[] = [];

    for (let i = 0; i < body.length; i++) {
      const cell = body[i];
      let data: { [key: string]: string } = {};
      for (let j = 0; j < cell.length; j++) {
        const head = selectedColumns[`column_${j}`];
        if (head) {
          data[head] = cell[j];
        }
      }
      if (data) {
        mappedData.push(data);
      }
    }

    const formattedData = mappedData.map(item => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
      accountId: selectedAccount,
    }));

    onSubmit(formattedData);
  };

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
        <CardTitle className='text-xl line-clamp-1'>
          Import Transaction
        </CardTitle>
        <div className='flex flex-col lg:flex-row items-center gap-2'>
          <Button onClick={onCancel} size='sm' className='w-full lg:w-auto'>
            Cancel
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size={'sm'}
                className='w-full lg:w-auto'
                disabled={progress < requiredOptions.length}
              >
                Continue
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Select Account</AlertDialogTitle>
                <AlertDialogDescription>
                  Please Select an account to continue.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Select
                placeholder='Select an account'
                options={accountOptions}
                onCreate={onCreateAccount}
                onChange={value => setSelectedAccount(value)}
                value={selectedAccount}
              />
              <AlertDialogFooter>
                <AlertDialogCancel disabled={creatingAccount}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={creatingAccount || !selectedAccount}
                  onClick={handleConfirm}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={onTableHeadSelectChange}
        />
      </CardContent>
    </Card>
  );
};
// 8:29
