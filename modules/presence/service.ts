import { TRPCError } from '@trpc/server';

import { stripTimeFromDate } from 'utils/dateHelpers';
import prisma from 'utils/prismaClient';

export const PresenceService = {
  async createMany(gradeId: number, studentIds: number[], date: Date) {
    const dateStripped = stripTimeFromDate(date);

    const studentCount = await prisma.student.count({
      where: {
        id: {
          in: studentIds,
        },
        gradeId,
      },
    });

    if (studentCount !== studentIds.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Не все из данных учеников обучаются в данном классе',
      });
    }

    const deletePrevious = prisma.studentPresence.deleteMany({
      where: {
        student: {
          gradeId,
        },
        date: dateStripped,
      },
    });
    const createNew = prisma.studentPresence.createMany({
      data: studentIds.map((id) => ({
        studentId: id,
        date: dateStripped,
      })),
      skipDuplicates: true,
    });
    const deactivateOrders = prisma.order.updateMany({
      where: {
        Student: {
          gradeId,
        },
        date: dateStripped,
      },
      data: {
        isActive: false,
      },
    });
    const activateOrders = prisma.order.updateMany({
      where: {
        studentId: { in: studentIds },
        date: dateStripped,
      },
      data: {
        isActive: true,
      },
    });

    return prisma.$transaction([deletePrevious, createNew, deactivateOrders, activateOrders]);
  },
};
