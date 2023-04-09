import { NextApiHandler } from 'next';

import { PartialDish } from 'types/Dish';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

/**
 * @swagger
 * /api/dishes/{dishId}:
 *  get:
 *    summary: Получает блюдо по id
 *  patch:
 *    summary: Обновляет блюдо с новыми данными
 *  delete:
 *    summary: Удаляет блюдо
 */
const handler: NextApiHandler = async (req, res) => {
  const dishId = idSchema.parse(req.query.dishId);
  if (!dishId) {
    return res.status(404).send('');
  }

  const session = await getServerSideSession({ req, res });
  const isWorkerOrAdmin = !!session && verifyRole(session, ['WORKER', 'ADMIN']);

  switch (req.method) {
    case 'GET': {
      const dish = await prisma.dish.findUnique({
        where: {
          id: dishId,
        },
      });
      if (!dish) {
        return res.status(404).send('Dish not found');
      }
      return res.send(dish);
    }

    case 'PATCH': {
      if (!isWorkerOrAdmin) {
        return res.status(403).send('');
      }

      const { partialDish } = req.body as { partialDish: PartialDish };
      try {
        const newDish = await prisma.dish.update({
          where: { id: dishId },
          data: partialDish,
        });
        return res.status(201).send(newDish);
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    }

    case 'DELETE':
      if (!isWorkerOrAdmin) {
        return res.status(403).send('');
      }
      try {
        const removePrefsWithDish = prisma.preference.deleteMany({
          where: { dishId },
        });
        const removeDish = prisma.dish.delete({
          where: {
            id: dishId,
          },
        });
        await prisma.$transaction([removePrefsWithDish, removeDish]);
        return res.send('OK');
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }

    default:
      return res.status(405).send('Method not allowed');
  }
};

export default handler;
