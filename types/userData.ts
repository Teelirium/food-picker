export type UserRole = "PARENT" | "TEACHER" | "WORKER" | "ADMIN";

export type UserData = {
  name: string;
  surname: string;
  middleName?: string;
  username: string;
  password: string;
};

export type UserFormData = {
  role: UserRole;
} & UserData;

export type dbUserData = {
  id: number;
  role?: UserRole;
} & UserData;

export type SessionData = {
  id: string;
  role: UserRole;
};
