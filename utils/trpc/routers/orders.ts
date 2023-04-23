import { getNextMonday } from 'utils/dateHelpers';
import prisma from 'utils/prismaClient';
import dateSchema from 'utils/schemas/dateSchema';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import { z } from 'zod';
import { auth, authParent, procedure, router } from '..';

export const ordersRouter = router({
  getThisWeeksOrders: procedure
    .use(auth(['PARENT', 'ADMIN']))
    .use(authParent)
    .input(
      z.object({
        studentId: idSchema,
        date: dateSchema,
        day: dayOfWeekSchema,
      }),
    )
    .query(async ({ input }) => {
      const { studentId, day, date } = input;
      const prevMonday = getNextMonday(date).addDays(-7);
      const orders = await prisma.order.findMany({
        where: {
          studentId,
          date: prevMonday.addDays(day),
        },
        select: {
          Dish: true,
        },
      });

      if (orders.length === 0) {
        const defaults = await prisma.preference.findMany({
          where: {
            isDefault: true,
          },
          select: {
            Dish: true,
          },
        });
        return new Map(defaults.map((pref) => [pref.Dish.type, pref.Dish]));
      }

      return new Map(
        orders.filter((order) => order.Dish).map((order) => [order.Dish!.type, order.Dish!]),
      );
    }),
});
