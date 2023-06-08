import { GradeNamePartial } from 'modules/grade/types';
import prisma from 'utils/prismaClient';

import { StudentCreateForm, StudentDto, StudentUpdateForm } from './types';

export const StudentService = {
  async getAll(grade: GradeNamePartial) {
    const students = await prisma.student.findMany({
      where: {
        grade,
      },
      include: {
        grade: true,
      },
    });
    return students satisfies StudentDto[];
  },

  async getById(id: number) {
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        grade: true,
      },
    });
    return student satisfies StudentDto | null;
  },

  async create(student: StudentCreateForm) {
    const newStudent = await prisma.student.create({
      data: {
        ...student,
      },
      include: {
        grade: true,
      },
    });
    return newStudent satisfies StudentDto;
  },

  async update(student: StudentUpdateForm) {
    const newStudent = await prisma.student.update({
      where: {
        id: student.id,
      },
      data: {
        ...student,
      },
    });
    return newStudent;
  },

  async delete(id: number) {
    const rmParentStudents = prisma.parentStudent.deleteMany({
      where: {
        studentId: id,
      },
    });
    const rmPreferences = prisma.preference.deleteMany({
      where: {
        studentId: id,
      },
    });
    const rmOrders = prisma.order.deleteMany({
      where: {
        studentId: id,
      },
    });
    const rmPresence = prisma.studentPresence.deleteMany({
      where: {
        studentId: id,
      },
    });
    const rmStudent = prisma.student.delete({ where: { id } });
    return prisma.$transaction([rmParentStudents, rmPreferences, rmOrders, rmPresence, rmStudent]);
  },
};
