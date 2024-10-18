import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[':id']['$patch']
>['json'];

export const useEditAccount = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.accounts[':id']['$patch']({
        param: { id },
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Account Updated' });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
    },
    onError: () => {
      toast({ title: 'Failed to update account', variant: 'destructive' });
    },
  });
  return mutation;
};
