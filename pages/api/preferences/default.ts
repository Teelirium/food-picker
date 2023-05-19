import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { PreferenceWithDish } from 'modules/preference/types';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  day: dayOfWeekSchema.optional(),
});

const bodySchema = z.object({
  dishId: idSchema,
});

/**
 * @swagger
 * /api/preferences/default?day={}:
 *  get:
 *    summary: Получает список стандартного питания
 *  post:
 *    summary: Добавляет блюдо в стандартное меню
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  if (!session) {
    return res.status(401).send('');
  }
  if (!verifyRole(session, ['ADMIN', 'WORKER'])) {
    return res.status(403).send('');
  }

  const { day } = paramSchema.parse(req.query);

  switch (req.method) {
    case 'GET': {
      return getHandler(day).then(res.json);
    }
    case 'POST': {
      return postHandler(req, res, day);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
};

export type DefaultDishes = Awaited<ReturnType<typeof getHandler>>;

async function getHandler(day?: number) {
  const prefs = await prisma.preference.findMany({
    where: {
      isDefault: true,
      dayOfWeek: day,
    },
    include: {
      Dish: true,
    },
  });
  return prefs.filter((p): p is PreferenceWithDish => !!p.Dish);
}

async function postHandler(req: NextApiRequest, res: NextApiResponse, day = 0) {
  const { dishId } = bodySchema.parse(req.body);

  const dishType = await prisma.dish.findUnique({
    where: {
      id: dishId,
    },
    select: {
      type: true,
    },
  });
  if (!dishType) return res.status(404).send('Dish not found');

  const existingPref = await prisma.preference.findFirst({
    where: {
      isDefault: true,
      dayOfWeek: day,
      Dish: {
        type: dishType.type,
      },
    },
  });

  const _ = existingPref
    ? await prisma.preference.update({
        where: {
          id: existingPref.id,
        },
        data: {
          dishId,
        },
        include: { Dish: true },
      })
    : await prisma.preference.create({
        data: {
          isDefault: true,
          dayOfWeek: day,
          dishId,
        },
        include: { Dish: true },
      });

  return res.status(201).send('OK');
}

export default handler;
