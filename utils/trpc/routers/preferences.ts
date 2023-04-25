import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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
});
