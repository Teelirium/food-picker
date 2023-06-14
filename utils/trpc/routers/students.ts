import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { gradeNamePartialSchema } from 'modules/grade/types';
import { StudentService } from 'modules/student/service';
import { studentCreateFormSchema, studentUpdateFormSchema } from 'modules/student/types';
import idSchema from 'utils/schemas/idSchema';

import { auth, procedure, router } from '..';

export const studentsRouter = router({
  getAll: procedure
    .use(auth(['ADMIN']))
    .input(gradeNamePartialSchema)
    .query(async (req) => {
      const { input } = req;
      const students = await StudentService.getAll(input);
      return students;
    }),

  getById: procedure
    .use(auth(['ADMIN']))
    .input(z.object({ id: idSchema }))
    .query(async (req) => {
      const { input } = req;
      const student = await StudentService.getById(input.id);
      if (!student) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Данный ученик не найден' });
      }
      return student;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(studentCreateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newStudent = await StudentService.create(input);
      return newStudent;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(studentUpdateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newStudent = await StudentService.create(input);
      return newStudent;
    }),

  delete: procedure
    .use(auth(['ADMIN']))
    .input(z.object({ id: idSchema }))
    .mutation(async (req) => {
      const { input } = req;
      await StudentService.delete(input.id);
    }),
});
