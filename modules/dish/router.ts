import { z } from 'zod';

import { DishService } from 'modules/dish/service';
import { idObjectSchema } from 'utils/schemas/idSchema';
import { auth, procedure, router } from 'utils/trpc';

export const dishesRouter = router({
  getAll: procedure
    .use(auth())
    .input(z.object({ includeHidden: z.boolean() }))
    .query(async (req) => {
      const { input } = req;
      const dishes = await DishService.getAll(undefined, input.includeHidden);
      return dishes;
    }),

  restore: procedure
    .use(auth(['ADMIN', 'WORKER']))
    .input(idObjectSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newDish = await DishService.restore(input.id);
      return newDish;
    }),
});
