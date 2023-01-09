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

export type GradeInfo = Grade & {
  dishes: DishWithOrders[];
};

type DishWithOrders = Prisma.DishGetPayload<{
  select: { id: true; name: true; weightGrams: true; type: true };
}> & { _count: { preferences: number } };

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

  switch (req.method) {
    case "GET": {
      const { day } = paramSchema.parse(req.query);

      const defaultPrefs = await prisma.preference.findMany({
        where: {
          isDefault: true,
        },
        select: {
          Dish: {
            select: {
              id: true,
              name: true,
              weightGrams: true,
              type: true,
            },
          },
        },
      });

      const grades = await prisma.grade.findMany({});
      const result: GradeInfo[] = [];
      for (let grade of grades) {
        const studentCount = await prisma.student.count({
          where: {
            gradeId: grade.id,
          },
        });

        const defaultDishes = defaultPrefs
          .map((pref) => {
            if (pref.Dish !== null)
              return {
                ...pref.Dish,
                _count: { preferences: studentCount },
              };
          })
          .filter((dish): dish is DishWithOrders => dish !== undefined);

        const dishes = await prisma.dish.findMany({
          select: {
            id: true,
            name: true,
            weightGrams: true,
            type: true,
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
        const nonEmpty = dishes.filter((dish) => dish._count.preferences > 0);

        for (let dish of nonEmpty) {
          const index = defaultDishes.findIndex((d) => d.type === dish.type); //inefficient

          if (index >= 0 && defaultDishes[index].id !== dish.id) {
            defaultDishes[index]._count.preferences -= dish._count.preferences;
          }
        }

        const gradeWithDishes = {
          ...grade,
          dishes: [
            ...nonEmpty,
            ...defaultDishes.filter((dish) => dish._count.preferences > 0),
          ],
        };
        result.push(gradeWithDishes);
      }

      return res.json(result);
    }
    default: {
      return res.status(405).send("");
    }
  }
};

export default handler;
