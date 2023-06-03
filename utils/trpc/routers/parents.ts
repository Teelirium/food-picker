import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { ParentService } from 'modules/parent/service';
import { userSchema } from 'modules/user/types';
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
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Родитель не найден' });
      }
      return parent;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(
      z.object({
        parent: userSchema,
        studentIds: z.number().array(),
      }),
    )
    .mutation(async (req) => {
      const { input } = req;
      const newParent = await ParentService.create(input.parent, input.studentIds);
      return newParent;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(
      z.object({
        parent: userSchema.extend({ id: idSchema }),
        studentIds: z.number().array().optional(),
      }),
    )
    .mutation(async (req) => {
      const { input } = req;
      const newParent = await ParentService.update(input.parent, input.studentIds);
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
