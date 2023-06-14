import { z } from 'zod';

import { PresenceService } from 'modules/presence/service';
import prisma from 'utils/prismaClient';
import dateSchema from 'utils/schemas/dateSchema';
import idSchema from 'utils/schemas/idSchema';

import { auth, authGradeOfTeacher, procedure, router } from '..';

export const presenceRouter = router({
  getPresenceSet: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authGradeOfTeacher)
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
    .use(authGradeOfTeacher)
    .input(
      z.object({
        gradeId: idSchema,
        date: dateSchema,
        students: z.array(idSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const { gradeId, students, date } = input;

      await PresenceService.createMany(gradeId, students, date);
    }),
});
