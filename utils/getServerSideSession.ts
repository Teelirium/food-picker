import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "pages/api/auth/[...nextauth]";

export default async function getSessionServerSide({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const session = await unstable_getServerSession(req, res, options);

  return session;
}
