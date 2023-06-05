import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { WorkerService } from 'modules/worker/service';
import { workerCreateFormSchema, workerUpdateFormSchema } from 'modules/worker/types';
import idSchema from 'utils/schemas/idSchema';

import { auth, authSelfAccess, procedure, router } from '..';

export const workersRouter = router({
  getAll: procedure.use(auth(['ADMIN'])).query(async () => {
    const workers = await WorkerService.getAll();
    return workers;
  }),

  getById: procedure
    .use(auth(['ADMIN', 'WORKER']))
    .use(authSelfAccess('WORKER'))
    .input(z.object({ id: idSchema }))
    .query(async (req) => {
      const { input } = req;
      const worker = await WorkerService.getById(input.id);
      if (!worker) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Данный работник не найден' });
      }
      return worker;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(workerCreateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newWorker = await WorkerService.create(input);
      return newWorker;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(workerUpdateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newWorker = await WorkerService.update(input);
      return newWorker;
    }),

  delete: procedure
    .use(auth(['ADMIN']))
    .input(z.object({ id: idSchema }))
    .mutation(async (req) => {
      const { input } = req;
      await WorkerService.delete(input.id);
    }),
});
