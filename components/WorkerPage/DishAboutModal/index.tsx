import { Dish } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

import ModalWrapper from 'components/ModalWrapper';
import deleteEmptyParams from 'utils/deleteEmptyParams';

import styles from './styles.module.scss';

interface Props {
  dishId: number;
  allowEditing?: boolean;
}

const DishAboutModal: React.FC<Props> = ({ dishId, allowEditing = false }) => {
  const router = useRouter();

  const dishQuery = useQuery(['query.data', dishId], () =>
    axios.get(`/api/dishes/${dishId}`).then((resp) => resp.data as Dish),
  );

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

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        {dishQuery.isSuccess && (
          <div className={styles.modalContent}>
            <div className={styles.close} onClick={toggle}>
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
            <img className={styles.dishImg} src={dishQuery.data.imgURL} alt="dishImg" />
            <div className={styles.dishInfo}>
              <div className={styles.nameAndWeight}>
                <div className={styles.name}>{dishQuery.data.name}</div>
                <div className={styles.weight}>Вес: {dishQuery.data.weightGrams} г.</div>
              </div>
              <div className={styles.price}>Стоимость: {dishQuery.data.price} руб.</div>
              <div className={styles.calories}>
                Энергетическая ценность (калорийность): {dishQuery.data.calories} ккал.
              </div>
              <ul className={styles.proteinsFatsAndCarbs}>
                <li>Белки: {dishQuery.data.proteins} г.</li>
                <li>Жиры: {dishQuery.data.fats} г.</li>
                <li>Углеводы: {dishQuery.data.carbs} г.</li>
              </ul>
              <div className={styles.ingredients}>
                Состав:
                <br />
                {dishQuery.data.ingredients}
              </div>
              {allowEditing ? (
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
        )}
      </div>
    </ModalWrapper>
  );
};

export default DishAboutModal;
