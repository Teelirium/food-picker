import { Dish } from '@prisma/client';
import React from 'react';

import styles from './styles.module.css';

type Props = {
  dish: Dish | undefined;
  updateDish: (dish: Dish) => void;
};

const DishCard: React.FC<Props> = ({ dish, updateDish }) => {
  if (!dish) return null;
  return (
    <div className={styles.dishContainer}>
      <div
        className={styles.dish}
        style={{ backgroundImage: `url(${dish.imgURL})` }}
        onClick={() => updateDish(dish)}
      >
        <span className={styles.dishName}>{dish.name}</span>
        <span className={styles.dishPrice}>{dish.price}</span>
      </div>
    </div>
  );
};

export default DishCard;
