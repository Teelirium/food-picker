import { Dish } from '@prisma/client';

import styles from './styles.module.scss';

type Props = {
  dish: Dish;
};

export default function DishCardSmall({ dish }: Props) {
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
}
