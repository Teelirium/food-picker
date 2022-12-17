import { Dish, Grade, Prisma } from "@prisma/client";
import { NextApiHandler } from "next";
import { getServerSideSession } from "utils/getServerSession";
import prisma from "utils/prismaClient";
import dayOfWeekSchema from "utils/schemas/dayOfWeekSchema";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const paramSchema = z.object({
  day: dayOfWeekSchema.optional(),
});

export type GetResponse = Prisma.GradeGetPayload<{}> & {
  dishes: (Dish & { _count: { preferences: number } })[];
};

/**
 * @swagger
 * /api/grades/total-orders:
 *  get:
 *    summary: Получает список классов с количеством заказанных блюд в каждом
 *    parameters:
 *    - in: query
 *      name: day
 *      description: День по которому фильтровать заказы
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });

  if (!session) return res.status(401).send("");
  if (!verifyRole(session, ["ADMIN", "TEACHER", "WORKER"]))
    return res.status(403).send("");

  const { day } = paramSchema.parse(req.query);

  switch (req.method) {
    case "GET": {
      const grades = await prisma.grade.findMany({});
      const result: GetResponse[] = [];
      for (let grade of grades) {
        const dishes = await prisma.dish.findMany({
          include: {
            _count: {
              select: {
                preferences: {
                  where: {
                    dayOfWeek: day,
                    Student: {
                      gradeId: grade.id,
                    },
                  },
                },
              },
            },
          },
        });
        const gradeWithDishes = {
          ...grade,
          dishes: dishes.filter((dish) => dish._count.preferences > 0),
        };
        result.push(gradeWithDishes);
      }

      return res.json(result);
    }
  }
};

export default handler;
