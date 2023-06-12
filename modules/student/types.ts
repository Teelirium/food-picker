import { Grade, Student } from '@prisma/client';
import { z } from 'zod';

import { fullNameSchema } from 'modules/user/types';
import idSchema from 'utils/schemas/idSchema';

export type StudentDto = Student & { grade: Grade | null };

export const studentCreateFormSchema = fullNameSchema.extend({ gradeId: idSchema });
export type StudentCreateForm = z.infer<typeof studentCreateFormSchema>;

export const studentUpdateFormSchema = studentCreateFormSchema.extend({ id: idSchema });
export type StudentUpdateForm = z.infer<typeof studentUpdateFormSchema>;
