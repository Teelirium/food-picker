import { UserData } from 'modules/user/types';

export type UserRole = 'PARENT' | 'TEACHER' | 'WORKER' | 'ADMIN';

export type FullName = {
  name: string;
  surname: string;
  middleName: string | null;
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
