import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SessionData, dbUserData } from "types/UserData";

const prisma = new PrismaClient();

async function findUser(username: string): Promise<dbUserData | null> {
  const parent = await prisma.parent.findUnique({
    where: {
      username,
    },
  });
  if (parent) {
    return { ...parent, role: "PARENT" };
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      username,
    },
  });
  if (teacher) {
    return { ...teacher, role: "TEACHER" };
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
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials, req) {
        const error = Promise.reject(new Error('Invalid credentials'));

        if (!credentials) {
          return error;
        }

        const { username, password } = credentials;
        const user = await findUser(username);
        if (!user) {
          return error;
        }

        const isCorrectPassword = await compare(password, user.password);
        if (isCorrectPassword) {
          const data: SessionData = {
            id: user.id.toString(),
            role: user.role,
          };
          return data;
        }
        
        return error;
      },
    }),
  ],
  
  callbacks: {
    jwt({ token, user, account, profile, isNewUser }) {
      //console.log("JWT", token, "\n", "User", user);
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token, user }) {
      //console.log(session, token, user)
      session.user = token.user as SessionData;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(options);