import { NextApiHandler } from 'next';

import { Parent } from 'types/Parent';
import exclude from 'utils/exclude';
import prisma from 'utils/prismaClient';

/**
 * @swagger
 * /api/parents/{id}:
 *  get:
 *    summary: Получает родителя по id
 *    parameters:
 *      - in: path
 *        name: parentId
 *        schema:
 *          type: integer
 *          required: true
 *      - in: query
 *        name: children
 *        schema:
 *          type: boolean
 *    responses:
 *      200:
 *        description: Возвращает найденного родителя
 *      404:
 *        description: Родитель не найден
 */
const handler: NextApiHandler = async (req, res) => {
  const { parentId, children } = req.query;

  if (!parentId) {
    return res.status(404).send('');
  }

  switch (req.method) {
    case 'GET': {
      const data = await prisma.parent.findUnique({
        where: {
          id: +parentId,
        },
      });
      if (!data) {
        return res.status(404).send('');
      }

      const parent = exclude(data, ['password']);
      if (children === 'true') {
        const parentStudents = await prisma.parentStudent.findMany({
          where: {
            parentId: +parentId,
          },
          include: {
            student: true,
          },
        });
        const children = parentStudents.map((p) => p.student);
        const parentWithChildren: Parent = { ...parent, children };

        return res.send(parentWithChildren);
      }
      return res.send(parent);
    }

    default:
      return res.status(405).send('Method not allowed');
  }
};

export default handler;
