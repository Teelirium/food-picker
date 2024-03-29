import { z } from 'zod';

import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';

import { auth, authGradeOfTeacher, procedure, router } from '..';

export const debtRouter = router({
  getDebtMap: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authGradeOfTeacher)
    .input(
      z.object({
        gradeId: idSchema,
      }),
    )
    .query(async ({ input }) => {
      const { gradeId } = input;

      const debts = await prisma.student.findMany({
        where: {
          gradeId,
        },
        select: {
          id: true,
          debt: true,
        },
      });

      const map = Object.fromEntries(debts.map((v) => [v.id, v.debt]));
      return map;
    }),

  setDebts: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authGradeOfTeacher)
    .input(z.object({ gradeId: idSchema, debts: z.record(z.coerce.number(), z.number()) }))
    .mutation(async ({ input }) => {
      const { gradeId, debts } = input;

      const oldDebts = await prisma.student.findMany({
        where: { gradeId },
        select: { id: true, debt: true },
      });

      const actions = oldDebts.map((oldDebt) =>
        prisma.student.update({
          where: {
            id: oldDebt.id,
          },
          data: {
            debt: debts[oldDebt.id],
          },
        }),
      );

      await prisma.$transaction(actions);
    }),
});
