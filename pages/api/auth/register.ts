import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import type { NextApiHandler } from "next";
import { UserFormData } from "../../../types/userData";

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      const { user } = req.body as { user: UserFormData };
      console.log(user);
      const pwd = await hash(user.password, 12);
      
      switch (user.role) {
        case "PARENT":
            await prisma.parent.create({
                data: {
                    name: user.name,
                    surname: user.surname,
                    middleName: user.middleName,
                    username: user.username,
                    password: pwd
                }
            })
            break;
        default:
            break;
      }
      return res.send("OK");

    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
