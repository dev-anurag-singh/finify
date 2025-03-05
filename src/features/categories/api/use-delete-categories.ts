import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.categories)['delete-categories']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)['delete-categories']['$post']
>['json'];

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.categories['delete-categories'][
        '$post'
      ]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Categories deleted' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete categories', variant: 'destructive' });
    },
  });
  return mutation;
};
