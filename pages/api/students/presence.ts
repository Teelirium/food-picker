import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { z } from 'zod';

import { PresenceService } from 'modules/presence/service';
import HttpError from 'utils/errorUtils/HttpError';
import withErrHandler from 'utils/errorUtils/withErrHandler';
import { getServerSessionWithOpts } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import dateSchema from 'utils/schemas/dateSchema';
import idSchema from 'utils/schemas/idSchema';
import verifyRole from 'utils/verifyRole';

const paramSchema = z.object({
  gradeId: idSchema,
  date: dateSchema,
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
export default withErrHandler(async (req, res) => {
  const session = await getServerSessionWithOpts({ req, res });
  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const { gradeId, date } = paramSchema.parse(req.query);
  if (!(await verify(session, gradeId))) {
    throw new TRPCError({ code: 'FORBIDDEN' });
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

      await PresenceService.createMany(gradeId, students, date);

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
});

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
