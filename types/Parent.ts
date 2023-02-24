/* eslint-disable @typescript-eslint/ban-types */
import { Prisma } from '@prisma/client';

export type Parent = Omit<Prisma.ParentGetPayload<{}>, 'password'> & {
  children: Prisma.StudentGetPayload<{}>[];
};
