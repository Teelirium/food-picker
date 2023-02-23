import { Dish } from '@prisma/client';
import DishCardSmall from 'components/DishCardSmall';
import Image from 'next/image';
import React, { MouseEventHandler } from 'react';
import styles from './styles.module.scss';
import deleteIcon from 'public/svg/delete.svg';
import editIcon from 'public/svg/edit.svg';

type Props = {
  title: string;
  dish?: Dish;
  handleView?: MouseEventHandler<HTMLElement>;
  handleDelete?: MouseEventHandler<HTMLElement>;
  handleEdit?: MouseEventHandler<HTMLElement>;
};

const PreferenceSection: React.FC<Props> = ({
  title,
  dish,
  handleView,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div className={styles.container}>
      <span>{title}</span>
      <div className={styles.body}>
        {!!dish ? (
          <>
            <div onClick={handleView} style={{ width: '100%' }}>
              <DishCardSmall dish={dish} />
            </div>
            <div className={styles.btnGroup}>
              <button className={styles.actionBtn} data-action='delete' onClick={handleDelete}>
                <Image src={deleteIcon} alt='delete' />
                Удалить
              </button>
              <button className={styles.actionBtn} data-action='edit' onClick={handleEdit}>
                <Image src={editIcon} alt='edit' />
                Изменить
              </button>
            </div>
          </>
        ) : (
          '+ Добавить Блюдо'
        )}
      </div>
    </div>
  );
};

export default PreferenceSection;
