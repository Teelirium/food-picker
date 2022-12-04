import { Session } from "next-auth";
import { UserRole } from "types/UserData";

export default function verifyRole(
  session: Session,
  roles: UserRole[]
) {
  const authorized = roles.some((role) => role === session.user.role);
  return authorized;
}
