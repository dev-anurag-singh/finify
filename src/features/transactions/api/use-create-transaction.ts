import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>['json'];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Transaction Created' });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: () => {
      toast({ title: 'Failed to create transaction', variant: 'destructive' });
    },
  });
  return mutation;
};
