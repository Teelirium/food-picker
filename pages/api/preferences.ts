import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "pages/api/auth/[...nextauth]";
import verifyRoleServerSide from "utils/verifyRoleServerSide";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const { studentId } = req.query;
  if (!studentId) return res.status(404).send("");

  const day = req.query.day ? +req.query.day : undefined;
  if (typeof day === "number" && (day < 0 || day > 6))
    return res.status(400).send("Invalid day");

  const session = await unstable_getServerSession(req, res, options);
  if (!session) return res.status(403).send("");

  const allowed = await verifyRoleServerSide(req, res, ["ADMIN", "PARENT"]);
  if (!allowed) return res.status(403).send("");

  if (session.user.role === "PARENT") {
    const parentStudents = await prisma.parentStudent.count({
      where: {
        studentId: +studentId,
        parentId: +session.user.id,
      },
    });
    if (parentStudents === 0) return res.status(403).send("");
  }

  switch (req.method) {
    case "GET":
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
      return res.send(prefs);

    case "POST":
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

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
