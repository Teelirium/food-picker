import * as trpcNext from '@trpc/server/adapters/next';

import { createContext } from 'utils/trpc/context';
import { appRouter } from 'utils/trpc/routers/_app';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
