import { Dish } from "@prisma/client";
import React from "react";
import styles from "./styles.module.css";

type Props = {
  id: number;
  dish: Dish | undefined;
  updateDish: Function;
};

const DishCard: React.FC<Props> = React.forwardRef(({ dish, updateDish }, ref) => {
  if (!dish) return null;
  return (
    <div className={styles.dish}
            onClick={() => updateDish(dish)}>
        <span className={styles.dishName}>
            {dish.name}
        </span>
        <span className={styles.dishPrice}>
            {dish.price}
        </span>
    </div>
  );
});
DishCard.displayName;

export default DishCard;