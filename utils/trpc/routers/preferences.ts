import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { WEEKDAYS } from 'app.config';
import { DishService } from 'modules/dish/service';
import { PreferenceService } from 'modules/preference/service';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';

import { auth, authParent, procedure, router } from '..';

export const preferencesRouter = router({
  setPreference: procedure
    .use(auth(['PARENT']))
    .use(authParent)
    .input(
      z.object({
        studentId: idSchema,
        dishId: idSchema,
        day: dayOfWeekSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { studentId, dishId, day } = input;

      const dish = await DishService.getById(dishId);
      if (!dish || dish.isHidden)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Блюдо не найдено' });

      const deleteExisting = prisma.preference.deleteMany({
        where: {
          studentId,
          dayOfWeek: day,
          Dish: {
            type: dish.type,
          },
        },
      });
      const createNew = prisma.preference.create({
        data: {
          studentId,
          dayOfWeek: day,
          dishId,
        },
        include: { Dish: true },
      });

      const [, result] = await prisma.$transaction([deleteExisting, createNew]);
      return result;
    }),

  totalCost: procedure
    .use(auth(['PARENT', 'ADMIN']))
    .use(authParent)
    .input(
      z.object({
        studentId: idSchema,
      }),
    )
    .query(async ({ input }) => {
      const { studentId } = input;
      const transactions = WEEKDAYS.map((day) =>
        PreferenceService.getTotalCost(studentId, day).then((costs) =>
          costs.reduce((prev, cur) => prev + cur.price, 0),
        ),
      );
      const costsPerDay = await Promise.all(transactions);
      // return costs;
      const total = costsPerDay.reduce((prev, cur) => prev + cur, 0);
      return { total, costsPerDay };
    }),
});
