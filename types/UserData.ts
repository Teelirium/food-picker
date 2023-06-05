import { UserData } from 'modules/user/types';

export type UserRole = 'PARENT' | 'TEACHER' | 'WORKER' | 'ADMIN';

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
