import { NextApiHandler } from 'next';
import { Session } from 'next-auth';
import { z } from 'zod';

import { stripTimeFromDate } from 'utils/dateHelpers';
import { getServerSideSession } from 'utils/getServerSession';
import HttpError from 'utils/HttpError';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import withErrHandler from 'utils/validation/withErrHandler';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  gradeId: idSchema,
  date: z.preprocess((val) => stripTimeFromDate(z.coerce.date().parse(val)), z.date()),
});

const bodySchema = z.object({
  studentId: idSchema,
});

export type AbsentStudents = Awaited<ReturnType<typeof handleGet>>;

async function verify(session: Session, gradeId: number) {
  if (verifyRole(session, ['ADMIN'])) {
    return true;
  }
  if (!verifyRole(session, ['TEACHER'])) {
    return false;
  }
  const count = await prisma.grade.count({
    where: {
      id: gradeId,
      teacherId: +session.user.id,
    },
  });
  return count > 0;
}

/**
 * @swagger
 * /api/students/absent?gradeId={}&date={}:
 *  get:
 *    summary: Получает список присутствующих учеников
 *  post:
 *    summary: Добавляет ученика в список присутствующих
 *  put:
 *    summary: Полностью обновляет список присутствующих в классе
 *  delete:
 *    summary: Удаляет все записи об присутствии ученика в некоторый день
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  if (!session) {
    throw new HttpError('Unauthorized', 401);
  }

  const { gradeId, date } = paramSchema.parse(req.query);
  if (!(await verify(session, gradeId))) {
    throw new HttpError('Forbidden', 403);
  }

  switch (req.method) {
    case 'GET': {
      const students = await handleGet(date, gradeId);
      return res.json(students);
    }
    case 'POST': {
      const { studentId } = bodySchema.parse(req.body);

      const count = await prisma.student.count({
        where: {
          id: studentId,
          gradeId,
        },
      });
      if (count === 0) {
        throw new HttpError('Такой ученик не существует либо не обучается в данном классе', 404);
      }

      const existing = await prisma.studentPresence.findFirst({
        where: {
          studentId,
          date,
        },
        select: {
          id: true,
        },
      });
      if (!existing) {
        await prisma.studentPresence.create({
          data: {
            studentId,
            date,
          },
        });
        return res.send('OK');
      }
      return res.send('Запись уже существует');
    }
    case 'PUT': {
      const { students } = z.object({ students: z.array(idSchema) }).parse(req.body);
      const count = await prisma.student.count({
        where: {
          id: {
            in: students,
          },
          gradeId,
        },
      });
      if (count !== students.length) {
        throw new HttpError(
          'Один из учеников не существует либо не обучается в данном классе',
          404,
        );
      }

      await prisma.studentPresence.deleteMany({
        where: {
          studentId: {
            in: students,
          },
          date,
        },
      });

      await prisma.studentPresence.createMany({
        data: students.map((id) => ({
          studentId: id,
          date,
        })),
        skipDuplicates: true,
      });
      return res.send('OK');
    }
    case 'DELETE': {
      const { studentId } = bodySchema.parse(req.body);

      await prisma.studentPresence.deleteMany({
        where: {
          studentId,
          date,
        },
      });
      return res.send('OK');
    }
    default: {
      return res.status(405).send('Method not allowed');
    }
  }
};

export default withErrHandler(handler);

async function handleGet(date: Date, gradeId: number) {
  const students = await prisma.studentPresence.findMany({
    where: {
      student: {
        gradeId,
      },
      date,
    },
    include: {
      student: true,
    },
  });
  return students;
}

// async function addStudentPresence(studentId: number) {}
