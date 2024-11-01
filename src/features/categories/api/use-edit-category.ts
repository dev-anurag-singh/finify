import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.categories)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[':id']['$patch']
>['json'];

export const useEditCategory = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.categories[':id']['$patch']({
        param: { id },
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Category Updated' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', { id }] });
    },
    onError: () => {
      toast({ title: 'Failed to update category', variant: 'destructive' });
    },
  });
  return mutation;
};
