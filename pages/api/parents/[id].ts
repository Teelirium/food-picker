import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/parents/{id}:
 *  get:
 *    summary: Получает родителя по id
 *    responses:
 *      200:
 *        description: Возвращает найденного родителя
 *      404:
 *        description: Родитель не найден
 */
const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(404).send("");
  }

  switch (req.method) {
    case "GET":
      const parent = await prisma.parent.findUnique({
        where: {
          id: +id,
        },
      });
      if (!parent) {
        return res.status(404).send("");
      }
      return res.send(parent);

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
