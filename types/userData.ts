import { UserRole } from "./userRole";

export type UserData = {
  name: string;
  role: UserRole;
};

export type SessionData = {
  id: string;
  role: UserRole;
};
