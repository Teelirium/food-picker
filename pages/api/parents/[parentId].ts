import { ParentWithChildren } from 'types/Parent';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import exclude from 'utils/exclude';
import prisma from 'utils/prismaClient';

/**
 * @swagger
 * /api/parents/{id}:
 *  get:
 *    summary: Получает родителя по id
 */
export default withErrHandler(async (req, res) => {
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
        const parentWithChildren: ParentWithChildren = {
          ...parent,
          children,
        };

        return res.send(parentWithChildren);
      }
      return res.send(parent);
    }

    default:
      return res.status(405).send('Method not allowed');
  }
});
