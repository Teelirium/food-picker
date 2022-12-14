import { Preference, PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { getServerSideSession } from "utils/getServerSession";
import isParentOf from "utils/isParentOf";
import isValidDay from "utils/isValidDay";
import verifyRole from "utils/verifyRole";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(404).send("");

  const day = req.query.day ? +req.query.day : undefined;
  if (typeof day === "number" && !isValidDay(day))
    return res.status(400).send("Invalid day");

  const session = await getServerSideSession({ req, res });
  if (!session) return res.status(401).send("");

  const allowed = verifyRole(session, ["ADMIN", "PARENT"]);
  const isParent = await isParentOf(session, +studentId);
  if (!allowed || !isParent) return res.status(403).send("");

  switch (req.method) {
    case "GET": {
      const prefs = await prisma.preference.findMany({
        where:
          typeof day === "number"
            ? {
                studentId: +studentId,
                dayOfWeek: day,
              }
            : {
                studentId: +studentId,
              },
        include: {
          Dish: true,
        },
      });
      return res.send(prefs.filter(p => p.Dish !== null));
    }
    case "POST": {
      const { dishId } = req.body;
      if (typeof day !== "number" || typeof dishId !== "number")
        return res.status(400).send("");

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
          studentId: +studentId,
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
              studentId: +studentId,
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

export default handler;
