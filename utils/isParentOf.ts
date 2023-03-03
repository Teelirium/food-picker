import { Session } from 'next-auth';

import prisma from 'utils/prismaClient';

export default async function isParentOf(session: Session, childId: number) {
  if (session.user.role !== 'PARENT') {
    return false;
  }

  const relations = await prisma.parentStudent.count({
    where: {
      studentId: childId,
      parentId: +session.user.id,
    },
  });
  return relations > 0;
}
