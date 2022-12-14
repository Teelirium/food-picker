export type UserRole = "PARENT" | "TEACHER" | "WORKER" | "ADMIN";

export type FullName = {
  name: string;
  surname: string;
  middleName?: string | null;
};

export type UserData = FullName & {
  username: string;
  password: string;
};

export type UserFormData = {
  role: UserRole;
} & UserData;

export type dbUserData = {
  id: number;
  role: UserRole;
} & UserData;

export type SessionData = {
  id: string;
  role: UserRole;
};
