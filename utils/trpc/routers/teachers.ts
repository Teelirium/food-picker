import { TRPCError } from '@trpc/server';

import { TeacherService } from 'modules/teacher/service';
import { teacherCreateFormSchema, teacherUpdateFormSchema } from 'modules/teacher/types';
import { idObjectSchema } from 'utils/schemas/idSchema';

import { auth, authSelfAccess, procedure, router } from '..';

export const teachersRouter = router({
  getAll: procedure.use(auth(['ADMIN'])).query(async () => {
    const teachers = await TeacherService.getAll();
    return teachers;
  }),

  getById: procedure
    .use(auth(['ADMIN', 'TEACHER']))
    .use(authSelfAccess('TEACHER'))
    .input(idObjectSchema)
    .query(async (req) => {
      const { input } = req;
      const teacher = await TeacherService.getById(input.id);
      if (!teacher) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Данный учитель не найден' });
      }
      return teacher;
    }),

  create: procedure
    .use(auth(['ADMIN']))
    .input(teacherCreateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newTeacher = await TeacherService.create(input);
      return newTeacher;
    }),

  update: procedure
    .use(auth(['ADMIN']))
    .input(teacherUpdateFormSchema)
    .mutation(async (req) => {
      const { input } = req;
      const newTeacher = await TeacherService.update(input);
      return newTeacher;
    }),

  delete: procedure
    .use(auth(['ADMIN']))
    .input(idObjectSchema)
    .mutation(async (req) => {
      const { input } = req;
      await TeacherService.delete(input.id);
    }),
});
