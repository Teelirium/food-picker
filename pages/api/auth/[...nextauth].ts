import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SessionData, UserData } from "../../../types/userData";

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
        if (
          credentials?.username === "admin" &&
          credentials.password === "admin"
        ) {
          const data: SessionData = {
            id: "1",
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
      console.log("JWT", token, "User", user);
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
