import { Prisma } from '@prisma/client';
import { z } from 'zod';

import prisma from 'utils/prismaClient';

import {
  GradeCreateForm,
  GradeDto,
  GradeFullDto,
  GradeNamePartial,
  GradeUpdateForm,
} from './types';

const teacherSelect = {
  select: { id: true, name: true, surname: true, middleName: true },
} satisfies Prisma.TeacherArgs;

export const GradeService = {
  async getAll(filterParams: GradeNamePartial) {
    const grades = await prisma.grade.findMany({
      where: {
        ...filterParams,
      },
      include: {
        teacher: teacherSelect,
      },
    });
    return grades satisfies GradeDto[];
  },

  async getById(id: number) {
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: { teacher: teacherSelect, students: true },
    });
    if (!grade) return grade;
    return grade satisfies GradeFullDto;
  },

  async create(grade: GradeCreateForm) {
    const { studentIds, ...gradeData } = grade;
    const newGrade = await prisma.grade.create({
      data: { ...gradeData },
      include: { teacher: teacherSelect, students: true },
    });
    await prisma.student.updateMany({
      where: {
        id: { in: studentIds },
      },
      data: {
        gradeId: newGrade.id,
      },
    });
    const students = await prisma.student.findMany({
      where: {
        gradeId: newGrade.id,
      },
    });
    newGrade.students = students;
    return newGrade satisfies GradeFullDto;
  },

  async update(grade: GradeUpdateForm) {
    const { studentIds, ...gradeData } = grade;

    const resetGrade = prisma.student.updateMany({
      where: {
        gradeId: gradeData.id,
      },
      data: {
        gradeId: null,
      },
    });
    const setGrade = prisma.student.updateMany({
      where: {
        id: { in: studentIds },
      },
      data: {
        gradeId: gradeData.id,
      },
    });
    await prisma.$transaction([resetGrade, setGrade]);

    const newGrade = await prisma.grade.update({
      where: { id: gradeData.id },
      data: {
        ...gradeData,
      },
      include: { teacher: teacherSelect, students: true },
    });
    return newGrade;
  },

  async delete(id: number) {
    const resetGrade = prisma.student.updateMany({
      where: {
        gradeId: id,
      },
      data: {
        gradeId: null,
      },
    });
    const rmGrade = prisma.grade.delete({
      where: {
        id,
      },
    });
    return prisma.$transaction([resetGrade, rmGrade]);
  },
};
