import { procedure, router } from '..';

export const appRouter = router({
  hello: procedure.query(() => {
    return 'hello';
  }),
});

export type AppRouter = typeof appRouter;
