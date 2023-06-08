import { z } from 'zod';

export const fullNameSchema = z.object({
  name: z.string(),
  surname: z.string(),
  middleName: z.string().nullable(),
});
export type FullName = z.infer<typeof fullNameSchema>;

export const userDataSchema = fullNameSchema.extend({
  username: z.string(),
  password: z.string(),
});
export type UserData = z.infer<typeof userDataSchema>;
