import { procedure, router } from '..';

import { debtRouter } from './debt';
import { ordersRouter } from './orders';
import { presenceRouter } from './presence';

export const appRouter = router({
  debt: debtRouter,
  presence: presenceRouter,
  orders: ordersRouter,
  hello: procedure.query(() => {
    return 'hello';
  }),
});

export type AppRouter = typeof appRouter;
