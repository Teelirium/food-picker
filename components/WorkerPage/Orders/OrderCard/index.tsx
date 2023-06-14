import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { GradeOrders } from 'modules/orders/types';
import { addDays, getNextMonday, stripTimeFromDate } from 'utils/dateHelpers';

import styles from './styles.module.scss';

type Props = {
  order: GradeOrders;
  weekDay: number;
};

const OrderCard: React.FC<Props> = ({ order, weekDay }) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const openModal = (id: number) => {
    router.replace({ pathname: '', query: { ...router.query, dishId: id } }, undefined, {
      shallow: true,
    });
  };

  const selectedDay = addDays(getNextMonday(stripTimeFromDate(new Date())), -7 + weekDay);

  const dishesForDay = order.dishes[selectedDay.toISOString()] || {};

  const ordersTable = Object.values(dishesForDay).map((dish) => {
    return (
      <div key={dish.id} className={styles.dishRow}>
        <div className={styles.dishTd}>{dish.name}</div>
        <div className={styles.dishTd}>{dish.count}</div>
        <div className={styles.dishTd}>{dish.weightGrams}</div>
        <div className={styles.dishTd}>
          <div className={styles.aboutBtn} onClick={() => openModal(dish.id)}>
            <span>...</span>
          </div>
        </div>
      </div>
    );
  });

  if (!order.grade) return null;

  return (
    <div className={styles.orderContainer}>
      <div
        className={isOpen ? `${styles.orderRow} ${styles.openOrder}` : styles.orderRow}
        onClick={() => setOpen(!isOpen)}
      >
        <div className={styles.orderInfo}>
          <span>{`${order.grade.number}  ${order.grade.letter} класс`}</span>
          <span>{`${order.grade.breakIndex + 1} перемена`}</span>
        </div>
        <img
          src="/img/arrow.png"
          alt="arrow"
          width={20}
          height={20}
          className={isOpen ? styles.arrowImg : styles.arrowUp}
        />
      </div>
      <div className={isOpen ? styles.orderDetailsContainer : styles.orderDetailsHide}>
        <div className={styles.orderDetails}>
          <div className={styles.orderTableHeads}>
            <div className={styles.orderTableHead}>Блюдо</div>
            <div className={styles.orderTableHead}>Количество</div>
            <div className={styles.orderTableHead}>гр./шт.</div>
            <div className={styles.orderTableHead}>Дополнительно</div>
          </div>
          {ordersTable}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
