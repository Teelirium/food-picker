import { compare, hash } from "bcryptjs";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const pwd = 'password';
    const h = await hash(pwd, 12);
    const result = await compare('passwor', h);
    res.json({pwd, h, result});
};

export default handler;
