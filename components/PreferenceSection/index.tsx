import { Dish } from '@prisma/client';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

import DishCardSmall from 'components/DishCardSmall';
import { ArrowDownIcon, PlusIcon } from 'components/ui/Icons';
import deleteIcon from 'public/svg/delete.svg';
import editIcon from 'public/svg/edit.svg';
import plusIcon from 'public/svg/plus.svg';

import styles from './styles.module.scss';

type Props = {
  title: string;
  dish?: Dish;
  oldDish?: Dish;
  handleView?: (id: number) => void;
  handleAdd?: MouseEventHandler<HTMLElement>;
  handleDelete?: MouseEventHandler<HTMLElement>;
  handleEdit?: MouseEventHandler<HTMLElement>;
  handleCancel?: MouseEventHandler<HTMLElement>;
};

export default function PreferenceSection({
  title,
  dish,
  oldDish,
  handleView,
  handleAdd,
  handleDelete,
  handleEdit,
  handleCancel,
}: Props) {
  return (
    <div className={styles.container}>
      <span>{title}</span>
      {dish || oldDish ? (
        <div className={styles.body}>
          {dish && oldDish && (
            <>
              <div className={styles.dishGroup}>
                <DishCardSmall
                  dish={oldDish}
                  className={styles.old}
                  onClick={() => handleView && handleView(oldDish.id)}
                />
                <ArrowDownIcon />
                <DishCardSmall onClick={() => handleView && handleView(dish.id)} dish={dish} />
              </div>
              <div className={styles.btnGroup}>
                {handleCancel && (
                  <button
                    className={styles.actionBtn}
                    data-action="edit"
                    onClick={handleCancel}
                    type="button"
                  >
                    Отменить выбор
                  </button>
                )}
              </div>
            </>
          )}
          {dish && !oldDish && (
            <>
              <DishCardSmall dish={dish} onClick={() => handleView && handleView(dish.id)} />
              <div className={styles.btnGroup}>
                {handleDelete && (
                  <button
                    className={styles.actionBtn}
                    data-action="delete"
                    onClick={handleDelete}
                    type="button"
                  >
                    <Image src={deleteIcon} alt="delete" />
                    Удалить
                  </button>
                )}
                {handleEdit && (
                  <button
                    className={styles.actionBtn}
                    data-action="edit"
                    onClick={handleEdit}
                    type="button"
                  >
                    <Image src={editIcon} alt="edit" />
                    Изменить
                  </button>
                )}
              </div>
            </>
          )}

          {!dish && oldDish && (
            <>
              <DishCardSmall
                dish={oldDish}
                className={styles.old}
                onClick={() => handleView && handleView(oldDish.id)}
              />
              <button className={styles.label} onClick={handleAdd} type="button">
                <PlusIcon /> Добавить Блюдо
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.body} onClick={handleAdd} role="button" tabIndex={0}>
          <span className={styles.label}>
            <PlusIcon /> Добавить Блюдо
          </span>
        </div>
      )}
    </div>
  );
}
