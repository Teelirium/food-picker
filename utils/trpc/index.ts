import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import SuperJSON from 'superjson';
import { z } from 'zod';

import { UserRole } from 'types/UserData';
import { getServerSideSession } from 'utils/getServerSession';
import prisma from 'utils/prismaClient';
import idSchema from 'utils/schemas/idSchema';

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

const idInputSchema = z.object({ id: idSchema });
export const authSelfAccess = (role: UserRole) =>
  middleware((req) => {
    const { ctx, rawInput, next } = req;
    const { id } = idInputSchema.parse(rawInput);
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Вход не выполнен' });
    }
    if (ctx.session.user.role === role) {
      if (+ctx.session.user.id !== id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Доступ запрещён' });
      }
    }
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });

const gradeIdInputSchema = z.object({ gradeId: idSchema });
export const authGradeOfTeacher = middleware(async ({ rawInput, ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Вход не выполнен' });
  }
  const { gradeId } = gradeIdInputSchema.parse(rawInput);
  if (ctx.session.user.role === 'TEACHER') {
    const count = await prisma.grade.count({
      where: {
        id: gradeId,
        teacherId: +ctx.session.user.id,
      },
    });
    if (count === 0) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Нет доступа к этому классу' });
    }
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

const studentIdInputSchema = z.object({ studentId: idSchema });
export const authChildOfParent = middleware(async ({ rawInput, ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Доступ запрещєн' });
  }
  const { studentId } = studentIdInputSchema.parse(rawInput);
  if (ctx.session.user.role === 'PARENT') {
    const count = await prisma.parentStudent.count({
      where: {
        studentId,
        parentId: +ctx.session.user.id,
      },
    });
    if (count === 0) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Нет доступа к этому ученику' });
    }
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
