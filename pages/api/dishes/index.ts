import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { Dish } from "../../../types/Dish";

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
 *    responses:
 *      201:
 *        description: Возвращает добавленное блюдо
 */
const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      const dishes = await prisma.dish.findMany({});
      return res.json(dishes);

    case "POST":
      const { dish } = req.body as { dish: Dish };
      console.log(dish);
      try {
        const result = await prisma.dish.create({
          data: { ...dish, preferences: {}, Orders: {} },
        });
        return res.status(201).json(result);
      } catch (err) {
        console.log(err);
        return res.status(500).send("Creating dish failed");
      }

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
