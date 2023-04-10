import * as trpcNext from '@trpc/server/adapters/next';

import { getServerSideSession } from 'utils/getServerSession';
import { appRouter } from 'utils/trpc/routers/_app';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async (ctx) => {
    const session = await getServerSideSession(ctx);
    return {
      session,
    };
  },
});
