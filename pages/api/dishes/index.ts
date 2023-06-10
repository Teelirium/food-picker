import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { DishService } from 'modules/dish/service';
import { DishFormData } from 'modules/dish/types';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  type: dishTypeSchema.optional(),
});

/**
 * @swagger
 * /api/dishes?type={}:
 *  get:
 *    summary: Получает список доступных блюд. Параметр type фильтрует блюда по типу.
 *  post:
 *    summary: Добавляет блюдо в базу данных.
 */
export default withErrHandler(async (req, res) => {
  const session = await getServerSideSession({ req, res });
  if (!session) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const isWorkerOrAdmin = verifyRole(session, ['WORKER', 'ADMIN']);

  const { type } = paramSchema.parse(req.query);

  switch (req.method) {
    case 'GET': {
      const dishes = await DishService.getAll(type);
      return res.json(dishes);
    }

    case 'POST': {
      if (!isWorkerOrAdmin) {
        return res.status(403).send('');
      }
      const { dish } = req.body as { dish: DishFormData };
      console.log(dish);
      try {
        const result = await prisma.dish.create({
          data: { ...dish, preferences: {}, Orders: {} },
        });
        return res.status(201).json(result);
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    }

    default:
      return res.status(405).send('Method not allowed');
  }
});
