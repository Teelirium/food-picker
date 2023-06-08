import { Grade, Student } from '@prisma/client';
import { z } from 'zod';

import { FullName } from 'modules/user/types';
import idSchema, { idObjectSchema } from 'utils/schemas/idSchema';

export const gradeNameSchema = z.object({
  letter: z.string().max(1),
  number: z.number(),
});
export type GradeName = z.infer<typeof gradeNameSchema>;

export const gradeNamePartialSchema = gradeNameSchema.partial();
export type GradeNamePartial = z.infer<typeof gradeNamePartialSchema>;

export type GradeDto = Grade & { teacher: FullName & { id: number } };
export type GradeFullDto = GradeDto & { students: Student[] };

export const gradeCreateFormSchema = gradeNameSchema.extend({
  breakIndex: z.number().min(0),
  teacherId: idSchema,
  studentIds: idSchema.array(),
});
export type GradeCreateForm = z.infer<typeof gradeCreateFormSchema>;

export const gradeUpdateFormSchema = gradeCreateFormSchema.merge(idObjectSchema);
export type GradeUpdateForm = z.infer<typeof gradeUpdateFormSchema>;
