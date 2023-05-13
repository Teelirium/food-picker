import { FullName } from 'types/UserData';

export function getFullName(user: FullName) {
  const fullName = `${user.surname} ${user.name}`;
  if (user.middleName) {
    return `${fullName} ${user.middleName}`;
  }
  return fullName;
}

export function getInitials(user: FullName) {
  const initials = `${user.surname} ${user.name[0]}`;
  if (user.middleName) {
    return `${initials} ${user.middleName[0]}`;
  }
  return initials;
}
