import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import { AppRouter } from './routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  ssr: false,
  config() {
    return {
      links: [httpBatchLink({ url: '/api/trpc' })],
    };
  },
});
