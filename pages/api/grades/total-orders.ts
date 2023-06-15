import { DishType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { OrderService } from 'modules/orders/service';
import { addDays, getNextMonday, stripTimeFromDate } from 'utils/dateHelpers';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dateSchema from 'utils/schemas/dateSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  date: dateSchema,
});

export type GradeOrderInfo = Awaited<ReturnType<typeof handleGet>>;

type DishWithOrders = Prisma.DishGetPayload<{
  select: { id: true; name: true; weightGrams: true; type: true };
}> & { _count: { preferences: number } };

/**
 * @swagger
 * /api/grades/total-orders?date={}:
 *  get:
 *    summary: Получает список классов с количеством заказанных блюд в каждом
 *    parameters:
 *    - in: query
 *      name: date
 *      description: Дата, относительно её возвращаются заказы на неделю
 */
export default withErrHandler(async (req, res) => {
  const session = await getServerSessionWithOpts({ req, res });

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!verifyRole(session, ['ADMIN', 'TEACHER', 'WORKER'])) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  switch (req.method) {
    case 'GET': {
      const { date } = paramSchema.parse(req.query);
      const today = stripTimeFromDate(date);
      const nextMonday = getNextMonday(today);
      const prevMonday = addDays(nextMonday, -7);
      const newData = await OrderService.getTotal(prevMonday, nextMonday);
      // const data = await handleGet(day);
      return res.json(newData);
    }
    default: {
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
    }
  }
});

async function handleGet(day?: number) {
  const defaultPrefs = await prisma.preference.findMany({
    where: {
      isDefault: true,
    },
    select: {
      Dish: {
        select: {
          id: true,
          name: true,
          weightGrams: true,
          type: true,
        },
      },
    },
  });

  const grades = await prisma.grade.findMany({});
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const grade of grades) {
    // eslint-disable-next-line no-await-in-loop
    const studentCount = await prisma.student.count({
      where: {
        gradeId: grade.id,
      },
    });

    const defaultDishMap = new Map(
      defaultPrefs
        .map((pref) => {
          if (pref.Dish === null) return;
          return [
            pref.Dish.type,
            {
              ...pref.Dish,
              _count: { preferences: studentCount },
            },
          ];
        })
        .filter((el): el is [DishType, DishWithOrders] => el !== undefined),
    );

    // eslint-disable-next-line no-await-in-loop
    const dishes = await prisma.dish.findMany({
      select: {
        id: true,
        name: true,
        weightGrams: true,
        type: true,
        _count: {
          select: {
            preferences: {
              where: {
                dayOfWeek: day,
                Student: {
                  gradeId: grade.id,
                },
              },
            },
          },
        },
      },
    });
    const nonEmpty = dishes.filter((dish) => dish._count.preferences > 0);

    // eslint-disable-next-line no-restricted-syntax
    for (const dish of nonEmpty) {
      const existing = defaultDishMap.get(dish.type);

      if (!!existing && existing.id !== dish.id) {
        existing._count.preferences -= dish._count.preferences;

        if (existing._count.preferences > 0) {
          defaultDishMap.set(dish.type, existing);
        } else {
          defaultDishMap.delete(dish.type);
        }
      }
    }

    const gradeWithDishes = {
      ...grade,
      dishes: Array.from(defaultDishMap.values()).concat(nonEmpty),
    };
    result.push(gradeWithDishes);
  }

  return result;
}
