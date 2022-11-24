import NextAuth, { DefaultSession } from "next-auth"
import { SessionData } from "./UserData"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: SessionData
  }
}