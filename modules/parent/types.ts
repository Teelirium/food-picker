import { Parent, Student } from '@prisma/client';
import { z } from 'zod';

import { userDataSchema } from 'modules/user/types';
import idSchema from 'utils/schemas/idSchema';

export type ParentDto = Omit<Parent, 'password'>;

export type ParentWithChildren = ParentDto & {
  children: Student[];
};

export const parentCreateFormSchema = userDataSchema.extend({ studentIds: z.number().array() });
export type ParentCreateForm = z.infer<typeof parentCreateFormSchema>;

export const parentUpdateFormSchema = parentCreateFormSchema
  .extend({ id: idSchema })
  .partial({ password: true });
export type ParentUpdateForm = z.infer<typeof parentUpdateFormSchema>;
