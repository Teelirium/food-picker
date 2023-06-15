import { hashSync } from 'bcryptjs';

import { UserData } from 'modules/user/types';
import exclude, { excludeMut } from 'utils/exclude';
import prisma from 'utils/prismaClient';

import { ParentDto, ParentUpdateForm } from './types';
import { unwrapStudents } from './util';

export const ParentService = {
  async getAll() {
    const parents = await prisma.parent.findMany({
      include: {
        parentStudent: {
          include: {
            student: { include: { grade: true } },
          },
        },
      },
    });
    const parentDtos = parents.map((p) => excludeMut(p, ['password'])) satisfies ParentDto[];
    return parentDtos;
  },

  async getById(id: number) {
    const parent = await prisma.parent.findUnique({
      where: {
        id,
      },
    });
    if (!parent) return parent;
    const parentDto = exclude(parent, ['password']) satisfies ParentDto;
    return parentDto;
  },

  async getByIdWithChildren(id: number) {
    const parent = await prisma.parent.findUnique({
      where: {
        id,
      },
      include: {
        parentStudent: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!parent) return parent;
    const parentWithChildren = unwrapStudents(parent);
    return parentWithChildren;
  },

  async create(parent: UserData, studentIds: number[]) {
    const hashed = hashSync(parent.password, 12);
    const newParent = await prisma.parent.create({
      data: {
        ...parent,
        password: hashed,
      },
    });
    await prisma.parentStudent.createMany({
      data: studentIds.map((id) => ({
        parentId: newParent.id,
        studentId: id,
      })),
    });
    const parentDto = exclude(newParent, ['password']) satisfies ParentDto;
    return parentDto;
  },

  async update(parentInput: ParentUpdateForm) {
    const { studentIds, ...parent } = parentInput;

    const hashed = parent.password ? hashSync(parent.password, 12) : undefined;
    const newParent = await prisma.parent.update({
      where: {
        id: parent.id,
      },
      data: {
        ...parent,
        password: hashed,
      },
    });
    if (studentIds) {
      await prisma.parentStudent.deleteMany({
        where: {
          parentId: newParent.id,
        },
      });
      await prisma.parentStudent.createMany({
        data: studentIds.map((id) => ({ parentId: newParent.id, studentId: id })),
      });
    }
    const parentDto = exclude(newParent, ['password']) satisfies ParentDto;
    return parentDto;
  },

  async delete(parentId: number) {
    const deleteRelations = prisma.parentStudent.deleteMany({
      where: {
        parentId,
      },
    });
    const deleteParent = prisma.parent.delete({
      where: { id: parentId },
    });
    return prisma.$transaction([deleteRelations, deleteParent]);
  },
};
