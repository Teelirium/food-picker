import { Dish, Grade } from "@prisma/client";
import { NextApiHandler } from "next";
import { getServerSideSession } from "utils/getServerSession";
import prisma from "utils/prismaClient";
import verifyRole from "utils/verifyRole";
import { number, z } from "zod";

// const paramSchema = z.object({
//   day: z.p
// })

export type GetResponse = Grade & {
  dishes: (Dish & { _count: { preferences: number } })[];
};

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });

  if (!session) return res.status(401).send("");
  if (!verifyRole(session, ["ADMIN", "TEACHER", "WORKER"]))
    return res.status(403).send("");

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
                    dayOfWeek: undefined,
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
