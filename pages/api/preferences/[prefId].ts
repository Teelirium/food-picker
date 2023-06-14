import { NextApiHandler } from 'next';

import { getServerSessionWithOpts } from 'utils/getServerSession';
import isParentOf from 'utils/isParentOf';
import prisma from 'utils/prismaClient';
import verifyRole from 'utils/verifyRole';

const handler: NextApiHandler = async (req, res) => {
  const { prefId } = req.query;
  if (!prefId) return res.status(404).send('');

  const preference = await prisma.preference.findUnique({
    where: {
      id: +prefId,
    },
  });
  if (!preference || preference.studentId === null) return res.status(404).send('');

  const session = await getServerSessionWithOpts({ req, res });
  if (!session) return res.status(401).send('');

  const allowed = verifyRole(session, ['PARENT', 'ADMIN']);
  if (!allowed) return res.status(403).send('');

  switch (req.method) {
    case 'DELETE': {
      const isParent = await isParentOf(session, preference.studentId);
      if (!verifyRole(session, ['ADMIN']) && !isParent) return res.status(403).send('');

      try {
        await prisma.preference.delete({
          where: {
            id: +prefId,
          },
        });
        return res.status(200).send('OK');
      } catch (err) {
        console.error(err);
        return res.status(500).send('');
      }
    }

    default:
      return res.status(405).send('Method not allowed');
  }
};

export default handler;
