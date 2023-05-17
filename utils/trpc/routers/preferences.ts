import { Dish, DishType, Preference } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { uniqBy } from 'lodash';
import { z } from 'zod';

import { MAX_WEEKDAYS, WEEKDAYS } from 'app.config';
import maxDay from 'utils/maxDay';
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

      const dish = await prisma.dish.findUnique({
        where: {
          id: dishId,
        },
        select: {
          type: true,
        },
      });
      if (!dish) throw new TRPCError({ code: 'NOT_FOUND', message: 'Блюдо не найдено' });

      const existingPreference = await prisma.preference.findFirst({
        where: {
          studentId,
          dayOfWeek: day,
          Dish: {
            type: dish.type,
          },
        },
        select: {
          id: true,
        },
      });

      const result = existingPreference
        ? await prisma.preference.update({
            where: {
              id: existingPreference.id,
            },
            data: {
              dishId,
            },
            include: { Dish: true },
          })
        : await prisma.preference.create({
            data: {
              studentId,
              dayOfWeek: day,
              dishId,
            },
            include: { Dish: true },
          });

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
        getTotalCosts(studentId, day).then((costs) =>
          costs.reduce((prev, cur) => prev + cur.price, 0),
        ),
      );
      const costs = await Promise.all(transactions);
      // return costs;
      const total = costs.reduce((prev, cur) => prev + cur, 0);
      return { total, costs };
    }),
});

async function getTotalCosts(studentId: number, dayOfWeek: number) {
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
