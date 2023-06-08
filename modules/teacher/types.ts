import { Grade, Teacher } from '@prisma/client';
import { z } from 'zod';

import { userDataSchema } from 'modules/user/types';
import idSchema from 'utils/schemas/idSchema';

export type TeacherDto = Omit<Teacher, 'password'> & { Grades: Grade[] };

export const teacherCreateFormSchema = userDataSchema;
export type TeacherCreateForm = z.infer<typeof teacherCreateFormSchema>;

export const teacherUpdateFormSchema = teacherCreateFormSchema
  .extend({ id: idSchema })
  .partial({ password: true });
export type TeacherUpdateForm = z.infer<typeof teacherUpdateFormSchema>;
