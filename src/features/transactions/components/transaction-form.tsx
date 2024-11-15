import { z } from 'zod';
import { Loader2, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/select';
import { DatePicker } from '@/components/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-accounts';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/amount-input';

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

function TransactionForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
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

  // LOADING CATEGORY OPTIONS

  const categoryQuery = useGetCategories();

  const { mutate: createCategory, isPending: creatingCategory } =
    useCreateCategory();

  const onCreateCategory = (name: string) => {
    createCategory({ name });
  };

  const categoryOptions =
    categoryQuery.data?.map(category => ({
      label: category.name,
      value: category.id,
    })) || [];

  const isDisabled = disabled || creatingAccount || creatingCategory;

  if (accountQuery.isLoading || categoryQuery.isLoading) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 pt-4'
      >
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transation date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='accountId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  disabled={isDisabled}
                  options={accountOptions}
                  placeholder='Select an account'
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  disabled={isDisabled}
                  options={categoryOptions}
                  placeholder='Select a category'
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='payee'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={isDisabled}
                  placeholder='Add a payee'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={isDisabled}
                  placeholder='0.00'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  disabled={isDisabled}
                  placeholder='Optional notes'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button disabled={isDisabled} className='w-full'>
          {id ? 'Save changes' : 'Create account'}
        </Button>
        {!!id && (
          <Button
            type='button'
            disabled={isDisabled}
            onClick={handleDelete}
            className='w-full'
            variant={'outline'}
          >
            <Trash className='size-4 mr-2' />
            Delete account
          </Button>
        )}
      </form>
    </Form>
  );
}

export default TransactionForm;
