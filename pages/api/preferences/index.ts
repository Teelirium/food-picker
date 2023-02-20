import { NextApiHandler } from 'next';
import { z } from 'zod';

import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const querySchema = z.object({
  day: dayOfWeekSchema.optional(),
  studentId: idSchema,
});

const bodySchema = z.object({
  dishId: idSchema,
});

const handler: NextApiHandler = async (req, res) => {
  const { day, studentId } = querySchema.parse(req.query);

  const session = await getServerSideSession({ req, res });
  if (!session) return res.status(401).send('');

  const isParent = await isParentOf(session, studentId);
  if (!verifyRole(session, ['ADMIN']) && !isParent) return res.status(403).send('');

  switch (req.method) {
    case 'GET': {
      const prefs = await prisma.preference.findMany({
        where: {
          studentId,
          dayOfWeek: day,
        },
        include: {
          Dish: true,
        },
      });
      return res.send(prefs.filter((p) => p.Dish !== null));
    }
    case 'POST': {
      const { dishId } = bodySchema.parse(req.body);

      if (day === undefined) {
        return res.status(400).send('День не указан');
      }

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
          studentId,
          dayOfWeek: day,
          Dish: {
            type: dishType.type,
          },
        },
        select: {
          id: true,
        },
      });

      const result = existingPref
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
              studentId,
              dayOfWeek: day,
              dishId,
            },
            include: { Dish: true },
          });

      return res.json(result);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
};

// async function addToDefaultMenu(res: NextApiResponse, dishId: number) {}

export default handler;
