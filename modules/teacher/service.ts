import { hashSync } from 'bcryptjs';

import { excludeMut } from 'utils/exclude';
import prisma from 'utils/prismaClient';

import { TeacherCreateForm, TeacherDto, TeacherUpdateForm } from './types';

export const TeacherService = {
  async getAll() {
    const teachers = await prisma.teacher.findMany({
      include: {
        Grades: true,
      },
    });
    const teacherDtos = teachers.map((t) => excludeMut(t, ['password'])) satisfies TeacherDto[];
    return teacherDtos;
  },

  async getById(id: number) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
      include: { Grades: true },
    });
    if (!teacher) return teacher;
    const teacherDto = excludeMut(teacher, ['password']) satisfies TeacherDto;
    return teacherDto;
  },

  async create(teacher: TeacherCreateForm) {
    const hashed = hashSync(teacher.password, 12);
    const newTeacher = await prisma.teacher.create({
      data: {
        ...teacher,
        password: hashed,
      },
      include: {
        Grades: true,
      },
    });
    const teacherDto = excludeMut(newTeacher, ['password']) satisfies TeacherDto;
    return teacherDto;
  },

  async update(teacher: TeacherUpdateForm) {
    const hashed = teacher.password ? hashSync(teacher.password, 12) : undefined;
    const newTeacher = await prisma.teacher.update({
      where: {
        id: teacher.id,
      },
      data: {
        ...teacher,
        password: hashed,
      },
      include: { Grades: true },
    });
    const teacherDto = excludeMut(newTeacher, ['password']) satisfies TeacherDto;
    return teacherDto;
  },

  async delete(id: number) {
    const rmGrades = prisma.grade.deleteMany({
      where: {
        teacherId: id,
      },
    });
    const rmTeacher = prisma.teacher.delete({
      where: { id },
    });
    return prisma.$transaction([rmGrades, rmTeacher]);
  },
};
