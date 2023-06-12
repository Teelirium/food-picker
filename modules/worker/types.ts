import { Worker } from '@prisma/client';
import { z } from 'zod';

import { userDataSchema } from 'modules/user/types';
import { UserRole } from 'types/UserData';
import idSchema from 'utils/schemas/idSchema';

const _roles = ['WORKER', 'ADMIN'] as const satisfies readonly UserRole[];
export const workerRoleSchema = z.enum(_roles);
export type WorkerRole = z.infer<typeof workerRoleSchema>;

export type WorkerDto = Omit<Worker, 'password'>;

export const workerCreateFormSchema = userDataSchema.extend({ role: workerRoleSchema });
export type WorkerCreateForm = z.infer<typeof workerCreateFormSchema>;

export const workerUpdateFormSchema = workerCreateFormSchema
  .extend({ id: idSchema })
  .partial({ password: true });
export type WorkerUpdateForm = z.infer<typeof workerUpdateFormSchema>;
