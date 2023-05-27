import { UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { ParentWithChildren } from 'types/Parent';

export function getParent(id?: number) {
  return {
    queryKey: ['parent', id ?? ''],
    staleTime: Infinity,
    queryFn: async () => {
      if (id === undefined) throw new Error('Родитель не указан');
      const parent = await axios
        .get(`/api/parents/${id}?children=true`)
        .then((res) => res.data as ParentWithChildren);
      console.log('Fetched parent');
      return parent;
    },
    onError() {
      toast.error('Не удалость получить информацию о родителе');
    },
    enabled: id !== undefined,
  } satisfies UseQueryOptions;
}
