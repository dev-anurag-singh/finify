import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[':id']['$delete']
>;

export const useDeleteTransaction = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[':id']['$delete']({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Transaction Deleted' });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete transaction', variant: 'destructive' });
    },
  });
  return mutation;
};
