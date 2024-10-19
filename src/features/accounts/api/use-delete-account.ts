import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[':id']['$delete']
>;

export const useDeleteAccount = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[':id']['$delete']({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Account Deleted' });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.removeQueries({ queryKey: ['account', { id }] });
    },
    onError: () => {
      toast({ title: 'Failed to delete account', variant: 'destructive' });
    },
  });
  return mutation;
};
