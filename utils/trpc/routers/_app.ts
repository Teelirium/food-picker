import { procedure, router } from '..';

import { debtRouter } from './debt';

export const appRouter = router({
  debt: debtRouter,
  hello: procedure.query(() => {
    return 'hello';
  }),
});

export type AppRouter = typeof appRouter;
