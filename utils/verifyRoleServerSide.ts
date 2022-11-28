import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "pages/api/auth/[...nextauth]";
import { UserRole } from "types/UserData";

export default async function verifyRoleServerSide(
  req: NextApiRequest,
  res: NextApiResponse,
  roles: UserRole[]
) {
  const session = await unstable_getServerSession(req, res, options);

  if (!session) {
    return false;
  }

  const authorized = roles.some((role) => role === session.user.role);

  return authorized;
}
