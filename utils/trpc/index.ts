import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import SuperJSON from 'superjson';
import { UserRole } from 'types/UserData';

import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';
import { z } from 'zod';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSideSession(opts);
  return {
    session,
  };
};

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

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

const teacherAuthInput = z.object({ gradeId: idSchema });
export const authTeacher = middleware(async ({ rawInput, ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Доступ запрещён' });
  }
  const { gradeId } = teacherAuthInput.parse(rawInput);
  if (ctx.session.user.role === 'TEACHER') {
    const count = await prisma.grade.count({
      where: {
        id: gradeId,
        teacherId: +ctx.session.user.id,
      },
    });
    if (count === 0) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'У вас нет доступа к этому классу' });
    }
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
