import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>['json'];

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.accounts.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Account Created' });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => {
      toast({ title: 'Failed to create account', variant: 'destructive' });
    },
  });
  return mutation;
};
