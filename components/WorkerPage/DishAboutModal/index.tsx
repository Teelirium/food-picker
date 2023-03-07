import { Dish } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import deleteEmptyParams from 'utils/deleteEmptyParams';

import styles from './styles.module.scss';

type Props = {
  dishId: number;
  page: string;
};

const Modal: React.FC<Props> = ({ dishId, page }) => {
  const router = useRouter();
  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    axios
      .get(`/api/dishes/${dishId}`)
      .then((resp) => setDish(resp.data))
      .catch(console.log);
  }, [dishId]);

  return (
    <div className={styles.active}>
      <div className={styles.modalContainer}>
        {dish ? (
          <div className={styles.modalContent}>
            <div
              className={styles.close}
              onClick={() => {
                router.replace(
                  {
                    pathname: '',
                    query: deleteEmptyParams({ ...router.query, dish: undefined }),
                  },
                  undefined,
                  {
                    shallow: true,
                  },
                );
              }}
            >
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
            <img className={styles.dishImg} src={dish.imgURL} alt="dishImg" />
            <div className={styles.dishInfo}>
              <div className={styles.nameAndWeight}>
                <div className={styles.name}>{dish.name}</div>
                <div className={styles.weight}>Вес: {dish.weightGrams} г.</div>
              </div>
              <div className={styles.price}>Стоимость: {dish.price} р.</div>
              <div className={styles.calories}>
                Энергетическая ценность (калорийность): {dish.calories} ккал
              </div>
              <ul className={styles.proteinsFatsAndCarbs}>
                <li>Белки: {dish.proteins} г.</li>
                <li>Жиры: {dish.fats} г.</li>
                <li>Углеводы: {dish.carbs} г.</li>
              </ul>

              <div className={styles.ingredients}>
                Состав: <br />
                {dish.ingredients}
              </div>
            </div>
          </div>
        ) : (
          'Loading'
        )}
      </div>
    </div>
  );
};

export default Modal;
