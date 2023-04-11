import { z } from 'zod';

import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';

import { auth, procedure, router } from '..';
import { TRPCError } from '@trpc/server';

export const debtRouter = router({
  getDebtMap: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .input(
      z.object({
        gradeId: idSchema,
      }),
    )
    .query(async ({ input, ctx }) => {
      const { gradeId } = input;

      if (ctx.session.user.role === 'TEACHER') {
        const count = await prisma.grade.count({
          where: {
            id: gradeId,
            teacherId: +ctx.session.user.id,
          },
        });
        if (count === 0) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'У вас нет доступа к этому классу' });
        }
      }

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
    .input(z.object({ gradeId: idSchema, debts: z.record(z.coerce.number(), z.number()) }))
    .mutation(async ({ input, ctx }) => {
      const { gradeId, debts } = input;

      if (ctx.session.user.role === 'TEACHER') {
        const count = await prisma.grade.count({
          where: {
            id: gradeId,
            teacherId: +ctx.session.user.id,
          },
        });
        if (count === 0) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'У вас нет доступа к этому классу' });
        }
      }

      const oldDebts = await prisma.student.findMany({
        where: { gradeId },
        select: { id: true, debt: true },
      });
      oldDebts.forEach(async (oldDebt) => {
        if (debts[oldDebt.id] === oldDebt.debt) {
          return;
        }
        await prisma.student.update({
          where: {
            id: oldDebt.id,
          },
          data: {
            debt: debts[oldDebt.id],
          },
        });
      });
    }),
});
