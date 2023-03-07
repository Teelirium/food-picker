import { Dish } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ModalWrapper from 'components/ModalWrapper';
import deleteEmptyParams from 'utils/deleteEmptyParams';

import styles from './styles.module.scss';

interface Props {
  dishId?: number;
  page: string;
}

const Modal: React.FC<Props> = ({ dishId, page }) => {
  const router = useRouter();
  const [dish, setDish] = useState<Dish | undefined>(undefined);

  const toggle = useCallback(() => {
    router.replace(
      {
        pathname: '',
        query: deleteEmptyParams({ ...router.query, dishId: undefined, modalMethod: undefined }),
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [router]);

  useEffect(() => {
    axios
      .get(`/api/dishes/${dishId}`)
      .then((resp) => setDish(resp.data))
      .catch(console.log);
  }, [dish, dishId]);

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        {dish ? (
          <div className={styles.modalContent}>
            <div className={styles.close} onClick={toggle}>
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

              {page === 'Dishes' ? (
                <Link
                  href={{ pathname: '', query: { ...router.query, modalMethod: 'UPDATE' } }}
                  shallow
                  replace
                >
                  <div className={styles.edit}>Редактировать</div>
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          'Loading'
        )}
      </div>
    </ModalWrapper>
  );
};

export default Modal;
