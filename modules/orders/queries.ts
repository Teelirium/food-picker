import { UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { TotalOrders } from './types';

export const totalOrdersQueryOpts = (date: Date) =>
  ({
    queryKey: ['total-orders'],
    queryFn: async () => {
      const resp = await axios.get(`/api/grades/total-orders?date=${date.toISOString()}`);
      const data = resp.data as TotalOrders;
      return data;
    },
    staleTime: Infinity,
    onError(err) {
      console.error(err);
      toast.error('Ошибка в получении заказов');
    },
  } satisfies UseQueryOptions);
