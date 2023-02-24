import { FullName } from 'types/UserData';

export default function getFullName(user: FullName) {
  const fullName = `${user.surname} ${user.name}`;
  if (user.middleName) {
    return `${fullName} ${user.middleName}`;
  }
  return fullName;
}
