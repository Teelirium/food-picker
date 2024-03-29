import { Dish } from '@prisma/client';
import { MouseEventHandler } from 'react';

import DishCardSmall from 'components/DishCardSmall';
import ThinButton from 'components/ThinButton';
import { ArrowDownIcon, DeleteIcon, EditIcon, PlusIcon } from 'components/ui/Icons';

import styles from './styles.module.scss';

type Props = {
  title: string;
  id?: string;
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
  id,
  dish,
  oldDish,
  handleView,
  handleAdd,
  handleDelete,
  handleEdit,
  handleCancel,
}: Props) {
  return (
    <div className={styles.container} id={id}>
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
                    Отменить изменения
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
                    <DeleteIcon />
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
                    <EditIcon />
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
              <ThinButton onClick={handleAdd}>
                <PlusIcon /> Добавить Блюдо
              </ThinButton>
            </>
          )}
        </div>
      ) : (
        <button className={styles.body} type="button" onClick={handleAdd}>
          <ThinButton>
            <PlusIcon /> Добавить Блюдо
          </ThinButton>
        </button>
      )}
    </div>
  );
}
