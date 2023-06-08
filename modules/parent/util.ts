import { Parent, ParentStudent, Student } from '@prisma/client';

import exclude from 'utils/exclude';

import { ParentWithChildren } from './types';

export function unwrapStudents(
  parent: Parent & { parentStudent: (ParentStudent & { student: Student })[] },
): ParentWithChildren {
  const parentStudents = parent.parentStudent;
  const parentDto = exclude(parent, ['password', 'parentStudent']);
  const children = parentStudents.map((ps) => ps.student);
  const finalParent = {
    ...parentDto,
    children,
  } satisfies ParentWithChildren;
  return finalParent;
}
