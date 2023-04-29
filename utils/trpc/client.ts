import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import SuperJSON from 'superjson';

import { AppRouter } from './routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  ssr: false,
  config() {
    return {
      transformer: SuperJSON,
      links: [httpBatchLink({ url: '/api/trpc' })],
    };
  },
});
