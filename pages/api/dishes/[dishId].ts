import { TRPCError } from '@trpc/server';

import { PartialDish } from 'types/Dish';
import withErrHandler from 'utils/errorUtils/withErrHandler';
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
export default withErrHandler(async (req, res) => {
  const dishId = idSchema.parse(req.query.dishId);
  if (!dishId) {
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }

  const session = await getServerSideSession({ req, res });
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const isWorkerOrAdmin = verifyRole(session, ['WORKER', 'ADMIN']);

  switch (req.method) {
    case 'GET': {
      const dish = await prisma.dish.findUnique({
        where: {
          id: dishId,
        },
      });
      if (!dish) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Такого блюда не существует' });
      }
      return res.send(dish);
    }

    case 'PATCH': {
      if (!isWorkerOrAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const { partialDish } = req.body as { partialDish: PartialDish };
      const newDish = await prisma.dish.update({
        where: { id: dishId },
        data: partialDish,
      });
      return res.status(201).send(newDish);
    }

    case 'DELETE': {
      if (!isWorkerOrAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      const removePrefsWithDish = prisma.preference.deleteMany({
        where: { dishId },
      });
      const disableDish = prisma.dish.update({
        where: {
          id: dishId,
        },
        data: {},
      });
      await prisma.$transaction([removePrefsWithDish, disableDish]);
      return res.send('OK');
    }

    default:
      throw new TRPCError({ code: 'METHOD_NOT_SUPPORTED' });
  }
});
