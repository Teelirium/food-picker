import { DishType, Prisma } from '@prisma/client';
import { NextApiHandler } from 'next';
import { z } from 'zod';

import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  day: dayOfWeekSchema.optional(),
});

export type GradeInfo = Awaited<ReturnType<typeof handleGet>>;

type DishWithOrders = Prisma.DishGetPayload<{
  select: { id: true; name: true; weightGrams: true; type: true };
}> & { _count: { preferences: number } };

/**
 * @swagger
 * /api/grades/total-orders:
 *  get:
 *    summary: Получает список классов с количеством заказанных блюд в каждом
 *    parameters:
 *    - in: query
 *      name: day
 *      description: День по которому фильтровать заказы
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });

  if (!session) return res.status(401).send('');
  if (!verifyRole(session, ['ADMIN', 'TEACHER', 'WORKER'])) return res.status(403).send('');

  switch (req.method) {
    case 'GET': {
      const { day } = paramSchema.parse(req.query);
      return res.json(await handleGet(day));
    }
    default: {
      return res.status(405).send('');
    }
  }
};

export default handler;

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
