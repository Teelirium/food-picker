import { z } from 'zod';

import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSideSession } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import prisma from 'utils/prismaClient';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  day: dayOfWeekSchema.optional(),
  studentId: idSchema,
});

export default withErrHandler(async (req, res) => {
  const { day, studentId } = paramSchema.parse(req.query);

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

    default:
      return res.status(405).send('Method not allowed');
  }
});
