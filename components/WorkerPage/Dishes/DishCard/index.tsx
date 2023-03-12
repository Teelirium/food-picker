import { Dish } from '@prisma/client';
import React from 'react';

import styles from './styles.module.scss';

type Props = {
  dish: Dish;
  onClick?: () => void;
  onButtonClick?: () => void;
};

const DishCard: React.FC<Props> = ({ dish, onClick, onButtonClick }) => {
  return (
    <div
      onClick={onClick}
      className={styles.container}
      style={{ backgroundImage: `url(${dish.imgURL})` }}
    >
      <div className={styles.info}>
        <span className={styles.name}>{dish.name}</span>
        <span className={styles.price}>{dish.price} руб.</span>
      </div>
      {onButtonClick && (
        <button
          type="button"
          className={styles.btn}
          onClick={(ev) => {
            ev.stopPropagation();
            onButtonClick();
          }}
        >
          Выбрать блюдо
        </button>
      )}
    </div>
  );
};

export default DishCard;
