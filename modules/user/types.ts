import { z } from 'zod';

export const userSchema = z.object({
  name: z.string(),
  surname: z.string(),
  middleName: z.string().nullable(),
  username: z.string(),
  password: z.string(),
});

export type UserData = z.infer<typeof userSchema>;
