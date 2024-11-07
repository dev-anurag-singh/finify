import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.transactions)['create-transactions']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)['create-transactions']['$post']
>['json'];

export const useCreateTransactions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.transactions['create-transactions'][
        '$post'
      ]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Transactions Created' });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast({ title: 'Failed to create transactions', variant: 'destructive' });
    },
  });
  return mutation;
};
