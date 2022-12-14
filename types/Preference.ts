import { Dish, Preference } from "@prisma/client";

export type PreferenceWithDish = Preference & { Dish: Dish };
