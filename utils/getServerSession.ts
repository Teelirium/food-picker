import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { options } from 'pages/api/auth/[...nextauth]';

export async function getServerSideSession(
  ctx: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse },
) {
  const session = await getServerSession(ctx.req, ctx.res, options);
  return session;
}
