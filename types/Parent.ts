import { FullName } from "./UserData";

export type Parent = FullName & {
  children: string[]
}