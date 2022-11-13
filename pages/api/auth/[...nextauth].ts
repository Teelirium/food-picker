import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {},
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.username === 'admin' && credentials.password === 'admin') {
            return {id: '1', name: 'Admin', extra: 'extra'}
        }
        return null;
      },

    }),
  ],
  callbacks: {
    session({ session, user, token }) {
        console.log(session)
        return session
    }
  },
};

export default NextAuth(options);
