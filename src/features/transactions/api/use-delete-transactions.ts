import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.transactions)['delete-transactions']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)['delete-transactions']['$post']
>['json'];

export const useDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.transactions['delete-transactions'][
        '$post'
      ]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Transactions deleted' });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      //   TODO: Also invalidate summary
    },
    onError: () => {
      toast({ title: 'Failed to delete transactions', variant: 'destructive' });
    },
  });
  return mutation;
};
