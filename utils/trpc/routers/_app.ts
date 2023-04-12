import { procedure, router } from '..';

import { debtRouter } from './debt';
import { presenceRouter } from './presence';

export const appRouter = router({
  debt: debtRouter,
  presence: presenceRouter,
  hello: procedure.query(() => {
    return 'hello';
  }),
});

export type AppRouter = typeof appRouter;
