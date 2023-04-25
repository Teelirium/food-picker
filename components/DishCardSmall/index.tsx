import { Dish } from '@prisma/client';
import classNames from 'classnames';
import { MouseEventHandler } from 'react';

import styles from './styles.module.scss';

type Props = {
  dish: Dish;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
};

export default function DishCardSmall({ dish, onClick, className }: Props) {
  return (
    <div
      className={classNames(styles.container, className, {
        clickable: !!onClick,
      })}
      onClick={onClick}
    >
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
