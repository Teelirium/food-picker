import { Dish } from '@prisma/client';
import DishCardSmall from 'components/DishCardSmall';
import Image from 'next/image';
import deleteIcon from 'public/svg/delete.svg';
import editIcon from 'public/svg/edit.svg';
import plusIcon from 'public/svg/plus.svg';
import React, { MouseEventHandler } from 'react';
import styles from './styles.module.scss';

type Props = {
  title: string;
  dish?: Dish;
  handleAdd?: MouseEventHandler<HTMLElement>;
  handleView?: MouseEventHandler<HTMLElement>;
  handleDelete?: MouseEventHandler<HTMLElement>;
  handleEdit?: MouseEventHandler<HTMLElement>;
};

const PreferenceSection: React.FC<Props> = ({
  title,
  dish,
  handleAdd,
  handleView,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div className={styles.container}>
      <span>{title}</span>
      {dish ? (
        <div className={styles.body}>
          <div onClick={handleView} style={{ width: '100%' }} role="button">
            <DishCardSmall dish={dish} />
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.actionBtn} data-action="delete" onClick={handleDelete}>
              <Image src={deleteIcon} alt="delete" />
              Удалить
            </button>
            <button className={styles.actionBtn} data-action="edit" onClick={handleEdit}>
              <Image src={editIcon} alt="edit" />
              Изменить
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.body} onClick={handleAdd} role="button">
          <span className={styles.label}>
            <Image src={plusIcon} alt="+" /> Добавить Блюдо
          </span>
        </div>
      )}
    </div>
  );
};

export default PreferenceSection;
