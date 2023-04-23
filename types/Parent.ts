import { Parent, Student } from '@prisma/client';

export type ParentWithChildren = Omit<Parent, 'password'> & {
  children: Student[];
};
