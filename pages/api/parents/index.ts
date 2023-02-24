import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/parents:
 *  get:
 *    summary: Получает всех родителей
 *    responses:
 *      200:
 *        description: Возвращает список родителей
 */
const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const parent = await prisma.parent.findMany({});
      return res.send(parent);
    }

    default:
      return res.status(405).send('Method not allowed');
  }
};

export default handler;
