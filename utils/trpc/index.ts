import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { getServerSideSession } from 'utils/getServerSession';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSideSession(opts);
  return {
    session,
  };
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const { router, procedure, middleware } = t;
