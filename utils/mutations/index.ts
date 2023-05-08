import { useQueryClient } from '@tanstack/react-query';

import { trpc } from 'utils/trpc/client';

export function useSetPreferenceMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return trpc.preferences.setPreference.useMutation({
    async onSuccess(data, variables) {
      const { studentId, day } = variables;
      queryClient.invalidateQueries(['preferences', { studentId, day }]);

      if (onSuccessCallback) onSuccessCallback();
    },
  });
}
