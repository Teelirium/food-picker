import { Dish } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';

import styles from './styles.module.css';
import Link from 'next/link';

type Props = {
  dish: Dish | undefined;
};

const DishCard: React.FC<Props> = ({ dish }) => {
  const router = useRouter();
  if (!dish) return null;
  return (
    <div className={styles.dishContainer}>
      <Link
        href={{ pathname: '', query: { ...router.query, modalMethod: 'GET', dishId: dish.id } }}
        shallow
        replace
      >
        <div className={styles.dish} style={{ backgroundImage: `url(${dish.imgURL})` }}>
          <span className={styles.dishName}>{dish.name}</span>
          <span className={styles.dishPrice}>{dish.price}</span>
        </div>
      </Link>
    </div>
  );
};

export default DishCard;
