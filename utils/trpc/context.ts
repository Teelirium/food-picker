import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { getServerSideSession } from 'utils/getServerSession';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSideSession(opts);
  return {
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
