import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import toast from 'react-hot-toast';

import { trpc } from 'utils/trpc/client';

export function useSetPreferenceMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return trpc.preferences.setPreference.useMutation({
    async onSuccess(data, variables) {
      const { studentId, day } = variables;

      const totalCostKey = getQueryKey(trpc.preferences.totalCost, { studentId });
      queryClient.invalidateQueries({ queryKey: totalCostKey });
      queryClient.invalidateQueries(['preferences', { studentId, day }]);

      if (onSuccessCallback) onSuccessCallback();
    },
    async onError() {
      toast.error('Не удалось установить предпочтение');
    },
  });
}
