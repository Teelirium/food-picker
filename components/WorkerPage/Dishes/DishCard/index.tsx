import { Dish } from '@prisma/client';
import React from 'react';

import styles from './styles.module.scss';

type Props = {
  dish: Dish;
  onClick: () => void;
  onButtonClick?: () => void;
};

const DishCard: React.FC<Props> = ({ dish, onClick, onButtonClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.container}
      style={{ backgroundImage: `url(${dish.imgURL})` }}
    >
      <div className={styles.info}>
        <span className={styles.name}>{dish.name}</span>
        <span className={styles.price}>{dish.price} руб.</span>
      </div>
      {onButtonClick && (
        <button type="button" className={styles.btn}>
          Выбрать блюдо
        </button>
      )}
    </button>
  );
};

export default DishCard;
