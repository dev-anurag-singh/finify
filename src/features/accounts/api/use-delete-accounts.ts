import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.accounts)['delete-accounts']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)['delete-accounts']['$post']
>['json'];

export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.accounts['delete-accounts']['$post']({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Accounts deleted' });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      //   TODO: Also invalidate summary
    },
    onError: () => {
      toast({ title: 'Failed to delete accounts', variant: 'destructive' });
    },
  });
  return mutation;
};
