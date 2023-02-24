import { Dish } from '@prisma/client';
import React from 'react';

import styles from './styles.module.scss';

type Props = {
  dish: Dish;
};

const DishCardSmall: React.FC<Props> = React.forwardRef(({ dish }, ref) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={dish.imgURL} alt={dish.name} loading="lazy" />
      </div>
      <div className={styles.info}>
        <strong>{dish.name}</strong>
        <span>{dish.price} рублей</span>
      </div>
    </div>
  );
});
DishCardSmall.displayName = 'DishCardSmall';

export default DishCardSmall;
