import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useToast } from '@/hooks/use-toast';

type ResponseType = InferResponseType<
  (typeof client.api.categories)[':id']['$delete']
>;

export const useDeleteCategory = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[':id']['$delete']({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast({ title: 'Category Deleted' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['category', { id }] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    },
  });
  return mutation;
};
