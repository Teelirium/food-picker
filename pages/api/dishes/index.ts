import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { DishFormData } from "types/Dish";
import { getServerSideSession } from "utils/getServerSession";
import verifyRole from "utils/verifyRole";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dishes:
 *  get:
 *    summary: Получает список доступных блюд
 *    responses:
 *      200:
 *        description: Возвращает список доступных блюд
 *  post:
 *    summary: Добавляет блюдо в базу данных
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              dish:
 *                type: object
 *    responses:
 *      201:
 *        description: Возвращает добавленное блюдо
 *  delete:
 *    summary: Удаляет все блюда
 */
const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSideSession({ req, res });
  const isWorkerOrAdmin = !!session && verifyRole(session, ["WORKER", "ADMIN"]);

  switch (req.method) {
    case "GET": {
      if (!session) {
        return res.status(401).send("");
      }
      const dishes = await prisma.dish.findMany({});
      return res.json(dishes);
    }

    case "POST":
      if (!isWorkerOrAdmin) {
        return res.status(403).send("");
      }
      const { dish } = req.body as { dish: DishFormData };
      console.log(dish);
      try {
        const result = await prisma.dish.create({
          data: { ...dish, preferences: {}, Orders: {} },
        });
        return res.status(201).json(result);
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }

    case "DELETE":
      if (!isWorkerOrAdmin) {
        return res.status(403).send("");
      }
      try {
        await prisma.dish.deleteMany({});
        return res.send("OK");
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
