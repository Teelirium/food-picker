import { TRPCError } from '@trpc/server';
import prisma from 'utils/prismaClient';
import dateSchema from 'utils/schemas/dateSchema';
import idSchema from 'utils/schemas/idSchema';
import { z } from 'zod';
import { auth, authTeacher, procedure, router } from '..';

export const presenceRouter = router({
  getPresenceSet: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authTeacher)
    .input(
      z.object({
        gradeId: idSchema,
        date: dateSchema,
      }),
    )
    .query(async ({ input }) => {
      const presenceList = await prisma.studentPresence.findMany({
        where: {
          student: {
            gradeId: input.gradeId,
          },
          date: input.date,
        },
        select: {
          student: {
            select: {
              id: true,
            },
          },
        },
      });
      const presenceSet = new Set(presenceList.map((p) => p.student.id));
      return presenceSet;
    }),

  setPresences: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authTeacher)
    .input(
      z.object({
        gradeId: idSchema,
        date: dateSchema,
        students: z.array(idSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const { gradeId, students, date } = input;

      const count = await prisma.student.count({
        where: {
          id: {
            in: students,
          },
          gradeId,
        },
      });
      if (count !== students.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Один из учеников не существует либо не обучается в данном классе',
        });
      }

      await prisma.studentPresence.deleteMany({
        where: {
          studentId: {
            in: students,
          },
          date,
        },
      });

      await prisma.studentPresence.createMany({
        data: students.map((id) => ({
          studentId: id,
          date,
        })),
        skipDuplicates: true,
      });
    }),
});
