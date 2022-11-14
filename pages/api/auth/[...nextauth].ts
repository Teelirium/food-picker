import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SessionData, UserData } from "../../../types/userData";

const prisma = new PrismaClient();

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
        if (!credentials) {
          return null;
        }

        const { username, password } = credentials;
        const user = await prisma.parent.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          return null;
        }

        const pwdCorrect = await compare(password, user.password);

        if (pwdCorrect) {
          const data: SessionData = {
            id: user.id.toString(),
            role: "PARENT",
          };
          return data;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account, profile, isNewUser }) {
      //console.log("JWT", token, "User", user);
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
};

export default NextAuth(options);
