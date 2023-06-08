import { procedure, router } from '..';

import { debtRouter } from './debt';
import { gradesRouter } from './grades';
import { ordersRouter } from './orders';
import { parentsRouter } from './parents';
import { preferencesRouter } from './preferences';
import { presenceRouter } from './presence';
import { studentsRouter } from './students';
import { teachersRouter } from './teachers';
import { workersRouter } from './workers';

export const appRouter = router({
  debt: debtRouter,
  presence: presenceRouter,
  orders: ordersRouter,
  preferences: preferencesRouter,
  parents: parentsRouter,
  workers: workersRouter,
  students: studentsRouter,
  teachers: teachersRouter,
  grades: gradesRouter,
  hello: procedure.query(() => {
    return 'hello';
  }),
});

export type AppRouter = typeof appRouter;
