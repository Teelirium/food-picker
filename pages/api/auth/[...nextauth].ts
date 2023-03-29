import { compare } from 'bcryptjs';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { SessionData, dbUserData } from 'types/UserData';
import prisma from 'utils/prismaClient';

async function findUser(username: string): Promise<dbUserData | null> {
  const parent = await prisma.parent.findUnique({
    where: {
      username,
    },
  });
  if (parent) {
    return { ...parent, role: 'PARENT' };
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      username,
    },
  });
  if (teacher) {
    return { ...teacher, role: 'TEACHER' };
  }

  const worker = await prisma.worker.findUnique({
    where: {
      username,
    },
  });
  if (worker) {
    return worker;
  }

  return null;
}

export const options: NextAuthOptions = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Логин', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Invalid credentials');
        }

        const { username, password } = credentials;
        const user = await findUser(username);
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await compare(password, user.password);
        if (isCorrectPassword) {
          const data: SessionData = {
            id: user.id.toString(),
            role: user.role,
          };
          return data;
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      // console.log("JWT", token, "\n", "User", user);
      if (!user) return token;
      return { ...token, user };
    },
    session({ session, token }) {
      // console.log(session, token, user)
      return { ...session, user: token.user as SessionData };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);
