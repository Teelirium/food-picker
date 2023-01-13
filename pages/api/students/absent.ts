import { NextApiHandler } from "next";
import { Session } from "next-auth";
import { getServerSideSession } from "utils/getServerSession";
import getTodayDate from "utils/getTodayDate";
import prisma from "utils/prismaClient";
import idSchema from "utils/schemas/idSchema";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const paramSchema = z.object({
  gradeId: idSchema,
  date: z.coerce.date()
});

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
    case 'GET': {
      const students = await prisma.absentStudent.findMany({
        where: {
          student: {
            gradeId: gradeId
          },
          date: date
        }
      })
      return res.json(students)
    }
    default: {
      return res.status(405).send('Method not allowed');
    }
  }
};

export default handler;
