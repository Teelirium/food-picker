import { Dish, DishType } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import ModalWrapper from 'components/ModalWrapper';
import { DishFormData } from 'modules/dish/types';
import deleteEmptyParams from 'utils/deleteEmptyParams';
import { ModalMethod } from 'utils/schemas/modalMethodSchema';
import { trpc } from 'utils/trpc/client';

import styles from './styles.module.scss';

interface Props {
  method: ModalMethod;
  dish?: Dish;
  dishType?: DishType;
}

const getHeaderDishType = (dishType?: DishType) => {
  switch (dishType) {
    case 'PRIMARY':
      return 'первого блюда';
    case 'SECONDARY':
      return 'горячего';
    case 'SIDE':
      return 'гарнира';
    case 'DRINK':
      return 'напитка';
    case 'EXTRA':
      return 'дополнительного';
    default:
      return '';
  }
};

const AddDishModal: React.FC<Props> = ({ method, dish, dishType }) => {
  const router = useRouter();
  const qClient = useQueryClient();
  const { register, handleSubmit } = useForm<DishFormData>();

  const toggleSelf = () =>
    router.replace(
      {
        pathname: '',
        query: deleteEmptyParams({ ...router.query, modalMethod: undefined, dishId: undefined }),
      },
      undefined,
      {
        shallow: true,
      },
    );

  const refetch = (dishId?: number) => {
    qClient.invalidateQueries(getQueryKey(trpc.dishes.getAll));
    if (dishId) qClient.invalidateQueries(['query.data', dishId]);
  };

  const onSubmit = handleSubmit((data) => {
    switch (method) {
      case 'POST': {
        axios
          .post('/api/dishes/', { dish: data })
          .then(() => {
            console.log('Блюдо добавлено!');
            refetch();
          })
          .catch(console.error);
        toggleSelf();
        break;
      }

      case 'UPDATE': {
        axios
          .patch(`/api/dishes/${dish?.id}`, { partialDish: data })
          .then(() => {
            console.log('Блюдо изменено!');
            refetch(dish?.id);
          })
          .catch(console.error);
        toggleSelf();
        break;
      }

      default:
        return;
    }
  });

  const restore = trpc.dishes.restore.useMutation();

  const onRestore = (dishId: number) => {
    restore
      .mutateAsync({ id: dishId })
      .then(() => {
        console.log(`Блюдо ${dishId} восстановлено`);
        refetch(dishId);
      })
      .catch(console.error);
    toggleSelf();
  };

  const onDelete = (dishId: number) => {
    axios
      .delete(`/api/dishes/${dishId}`)
      .then(() => {
        console.log('Блюдо удалено!');
        refetch(dishId);
      })
      .catch(console.error);
    toggleSelf();
  };

  return (
    <ModalWrapper toggle={toggleSelf}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.header}>
            {method === 'POST'
              ? `Добавление ${getHeaderDishType(dishType)}`
              : `Редактирование ${getHeaderDishType(dishType)}`}
            <div className={styles.closeBtn} onClick={toggleSelf}>
              <img src="/img/close.png" alt="close" width={20} height={20} />
            </div>
          </div>
          <label>
            <span style={{ marginRight: '15px' }}>Ссылка на изображение:</span>
            <div className={styles.inputBorder}>
              <input
                type="text"
                className={styles.formInput}
                defaultValue={dish?.imgURL}
                size={35}
                {...register('imgURL')}
              />
            </div>
          </label>
          <label>
            <span style={{ marginRight: '15px' }}>Название блюда:</span>
            <div className={styles.inputBorder}>
              <input
                type="text"
                className={styles.formInput}
                defaultValue={dish?.name}
                size={48}
                {...register('name')}
              />
            </div>
          </label>
          <label>
            <span style={{ marginRight: '173px' }}>Вес:</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.weightGrams}
                {...register('weightGrams', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <span> г.</span>
          </label>
          <label>
            <span style={{ marginRight: '86px' }}>Стоимость:</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.price}
                {...register('price', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <span> ₽</span>
          </label>
          <span>Энергетическая ценность</span>
          <label>
            <span style={{ marginRight: '31px' }}>(калорийность):</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.calories}
                {...register('calories', {
                  valueAsNumber: true,
                })}
              />
            </div>
          </label>
          <label>
            <span style={{ marginRight: '148px' }}>Белки:</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.proteins}
                {...register('proteins', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <span> г.</span>
          </label>
          <label>
            <span style={{ marginRight: '148px' }}>Жиры:</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.fats}
                {...register('fats', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <span> г.</span>
          </label>
          <label>
            <span style={{ marginRight: '107px' }}>Углеводы:</span>
            <div className={styles.inputBorder}>
              <input
                type="number"
                className={styles.formInput}
                defaultValue={dish?.carbs}
                {...register('carbs', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <span> г.</span>
          </label>
          <label>
            <span style={{ marginRight: '19px' }}>Состав:</span>
            <div className={styles.inputBorder}>
              <textarea
                className={`${styles.formInput} ${styles.ingredientsInput}`}
                defaultValue={dish?.ingredients}
                {...register('ingredients')}
              />
            </div>
          </label>

          <input
            className={styles.hiddenTypeInput}
            type="text"
            defaultValue={dishType}
            {...register('type')}
          />

          <div className={styles.formBtns}>
            <div className={styles.cancelBtn} onClick={toggleSelf}>
              Отмена
            </div>
            {method === 'UPDATE' && dish && (
              <div
                className={styles.removeBtn}
                onClick={() => {
                  if (dish.isHidden) {
                    return onRestore(dish.id);
                  }
                  onDelete(dish.id);
                }}
              >
                {dish.isHidden ? 'Восстановить' : 'Удалить'}
              </div>
            )}
            <button className={styles.submitBtn} type="submit">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddDishModal;
