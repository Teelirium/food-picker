import { DishType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { uniqBy } from 'lodash';
import { z } from 'zod';

import { WEEKDAYS } from 'app.config';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';

import { auth, authChildOfParent, procedure, router } from '..';

export const preferencesRouter = router({
  setPreference: procedure
    .use(auth(['PARENT']))
    .use(authChildOfParent)
    .input(
      z.object({
        studentId: idSchema,
        dishId: idSchema,
        day: dayOfWeekSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { studentId, dishId, day } = input;

      const dish = await prisma.dish.findUnique({
        where: {
          id: dishId,
        },
        select: {
          type: true,
        },
      });
      if (!dish) throw new TRPCError({ code: 'NOT_FOUND', message: 'Блюдо не найдено' });

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
    .use(authChildOfParent)
    .input(
      z.object({
        studentId: idSchema,
      }),
    )
    .query(async ({ input }) => {
      const { studentId } = input;
      const transactions = WEEKDAYS.map((day) =>
        getPreferenceTotal(studentId, day).then((costs) =>
          costs.reduce((prev, cur) => prev + cur.price, 0),
        ),
      );
      const costsPerDay = await Promise.all(transactions);
      // return costs;
      const total = costsPerDay.reduce((prev, cur) => prev + cur, 0);
      return { total, costsPerDay };
    }),
});

async function getPreferenceTotal(studentId: number, dayOfWeek: number) {
  const prefs: { price: number; type: DishType }[] =
    await prisma.$queryRaw`SELECT d.price, d.type, d.name FROM 
    Preference AS p JOIN Dish AS d ON p.dishId=d.id 
    WHERE studentId=${studentId} AND dayOfWeek=${dayOfWeek}
    UNION
    SELECT d.price, d.type, d.name FROM 
    Preference AS p JOIN Dish AS d ON p.dishId=d.id 
    WHERE isDefault=true AND dayOfWeek=${dayOfWeek}
    ORDER BY type;`;
  const unique = uniqBy(prefs, 'type');
  return unique;
}
