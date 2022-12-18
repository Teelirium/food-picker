import { NextApiHandler } from "next";
import { getServerSideSession } from "utils/getServerSession";
import isParentOf from "utils/isParentOf";
import prisma from "utils/prismaClient";
import dayOfWeekSchema from "utils/schemas/dayOfWeekSchema";
import idSchema from "utils/schemas/idSchema";
import verifyRole from "utils/verifyRole";
import { z } from "zod";

const querySchema = z.object({
  day: dayOfWeekSchema.optional(),
  studentId: idSchema,
});

const bodySchema = z.object({
  isDefault: z.literal(true).optional(),
  dishId: idSchema,
});

const handler: NextApiHandler = async (req, res) => {
  const { day, studentId } = querySchema.parse(req.query);

  const session = await getServerSideSession({ req, res });
  if (!session) return res.status(401).send("");

  const isParent = await isParentOf(session, studentId);
  if (!verifyRole(session, ["ADMIN", "WORKER"]) && !isParent)
    return res.status(403).send("");

  switch (req.method) {
    case "GET": {
      const prefs = await prisma.preference.findMany({
        where: {
          studentId: studentId,
          dayOfWeek: day,
        },
        include: {
          Dish: true,
        },
      });
      return res.send(prefs.filter((p) => p.Dish !== null));
    }
    case "POST": {
      const { dishId, isDefault } = bodySchema.parse(req.body);

      if (day === undefined) {
        return res.status(400).send("День не указан");
      }
      if (isDefault && verifyRole(session, ["ADMIN", "WORKER"])) {
        return res.status(403).send("");
      }

      const dishType = await prisma.dish.findUnique({
        where: {
          id: dishId,
        },
        select: {
          type: true,
        },
      });
      if (!dishType) return res.status(404).send("Dish not found");

      const existingPref = await prisma.preference.findFirst({
        where: {
          isDefault: isDefault,
          studentId: isDefault ? undefined : studentId,
          dayOfWeek: day,
          Dish: {
            type: dishType.type,
          },
        },
        select: {
          id: true,
        },
      });

      const result = existingPref
        ? await prisma.preference.update({
            where: {
              id: existingPref.id,
            },
            data: {
              dishId,
            },
            include: { Dish: true },
          })
        : await prisma.preference.create({
            data: {
              isDefault: !!isDefault,
              studentId: isDefault ? undefined : studentId,
              dayOfWeek: day,
              dishId,
            },
            include: { Dish: true },
          });
      return res.json(result);
    }
    default:
      return res.status(405).send("Method not allowed");
  }
};

//async function addToDefaultMenu(res: NextApiResponse, dishId: number) {}

export default handler;
