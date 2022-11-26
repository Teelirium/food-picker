import { Prisma } from "@prisma/client";

export type Preference = Prisma.PreferenceGetPayload<{}> & {
  Dish: Prisma.DishGetPayload<{}>
}