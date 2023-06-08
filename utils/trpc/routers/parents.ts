import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ParentService } from 'modules/parent/service';
import { parentCreateFormSchema, parentUpdateFormSchema } from 'modules/parent/types';
import idSchema from 'utils/schemas/idSchema';

import { auth, authSelfAccess, procedure, router } from '..';

export const parentsRouter = router({
  getAll: procedure.use(auth(['ADMIN'])).query(async () => {
    const parents = await ParentService.getAll();
    return parents;
  }),

  getById: procedure
    .use(auth(['ADMIN', 'PARENT']))
    .use(authSelfAccess('PARENT'))
    .input(z.object({ id: idSchema }))
    .query(async (req) => {
      const { input } = req;
      const parent = await ParentService.getByIdWithChildren(input.id);
      if (!parent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Данный родитель не найден' });
      }
      return parent;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(parentCreateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const { studentIds, ...parent } = input;
      const newParent = await ParentService.create(parent, studentIds);
      return newParent;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(parentUpdateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newParent = await ParentService.update(input);
      return newParent;
    }),

  delete: procedure
    .use(auth(['ADMIN']))
    .input(z.object({ id: idSchema }))
    .mutation(async (req) => {
      const { input } = req;
      await ParentService.delete(input.id);
    }),
});
