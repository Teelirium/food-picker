import { NextApiHandler } from "next";
import { Session } from "next-auth";
import { getServerSideSession } from "utils/getServerSession";
import prisma from "utils/prismaClient";
import idSchema from "utils/schemas/idSchema";
import stripTimeFromDate from "utils/stripTimeFromDate";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const paramSchema = z.object({
  gradeId: idSchema,
  date: z.preprocess(
    (val) => stripTimeFromDate(z.coerce.date().parse(val)),
    z.date()
  ),
});

const bodySchema = z.object({
  studentId: idSchema,
});

export type AbsentStudents = Awaited<ReturnType<typeof handleGet>>;

async function verify(session: Session, gradeId: number) {
  if (verifyRole(session, ["ADMIN"])) {
    return true;
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
 *    summary: Получает список отсутствующих учеников
 *  post:
 *    summary: Добавляет ученика в список отсутствующих
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  if (!session) {
    return res.status(401).send("");
  }

  const { gradeId, date } = paramSchema.parse(req.query);
  // console.log(gradeId, date, getTodayDate())
  if (
    !verifyRole(session, ["ADMIN", "TEACHER"]) ||
    !(await verify(session, gradeId))
  ) {
    return res.status(403).send("");
  }

  switch (req.method) {
    case "GET": {
      const students = await handleGet(date, gradeId);
      return res.json(students);
    }
    case "POST": {
      const { studentId } = bodySchema.parse(req.body);
      const existing = await prisma.absentStudent.findFirst({
        where: {
          studentId,
          date,
        },
        select: {
          id: true,
        },
      });
      await prisma.absentStudent.upsert({
        where: {
          id: existing?.id,
        },
        create: {
          studentId,
          date,
        },
        update: {},
      });
      return res.send("OK");
    }
    default: {
      return res.status(405).send("Method not allowed");
    }
  }
};

export default handler;

async function handleGet(date: Date, gradeId: number) {
  const students = await prisma.absentStudent.findMany({
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
