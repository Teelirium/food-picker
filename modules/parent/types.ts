import { Parent, Student } from '@prisma/client';

export type ParentDto = Omit<Parent, 'password'>;

export type ParentWithChildren = ParentDto & {
  children: Student[];
};
