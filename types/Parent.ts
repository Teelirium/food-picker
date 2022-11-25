import { Prisma } from "@prisma/client";

export type Parent = Omit<Prisma.ParentGetPayload<{}>, "password"> & {
  children: Prisma.StudentGetPayload<{}>[];
};
