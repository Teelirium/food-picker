import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { GradeService } from 'modules/grade/service';
import {
  gradeCreateFormSchema,
  gradeNamePartialSchema,
  gradeUpdateFormSchema,
} from 'modules/grade/types';
import idSchema, { idObjectSchema } from 'utils/schemas/idSchema';

import { auth, authGradeOfTeacher, procedure, router } from '..';

export const gradesRouter = router({
  getAll: procedure
    .use(auth(['ADMIN']))
    .input(gradeNamePartialSchema)
    .query(async (req) => {
      const { input } = req;
      const grades = await GradeService.getAll(input);
      return grades;
    }),

  getById: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authGradeOfTeacher)
    .input(
      z.object({
        gradeId: idSchema,
      }),
    )
    .query(async (req) => {
      const { input } = req;
      const grade = await GradeService.getById(input.gradeId);
      if (!grade) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Данный класс не найден' });
      }
      return grade;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(gradeCreateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newGrade = await GradeService.create(input);
      return newGrade;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(gradeUpdateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newGrade = await GradeService.update(input);
      return newGrade;
    }),

  delete: procedure
    .use(auth(['ADMIN']))
    .input(idObjectSchema)
    .mutation(async (req) => {
      const { input } = req;
      await GradeService.delete(input.id);
    }),
});
