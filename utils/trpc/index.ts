import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { UserRole } from 'types/UserData';

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

export const auth = (roles: UserRole[] = []) => {
  return middleware(({ ctx, next }) => {
    if (!ctx.session || (roles.length > 0 && !roles.includes(ctx.session.user.role))) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Доступ запрещён' });
    }
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });
};
