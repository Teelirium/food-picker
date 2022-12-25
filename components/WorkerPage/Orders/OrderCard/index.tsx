import { Dish } from "@prisma/client";
import { useRouter } from "next/router";
import { GetResponse } from "pages/api/grades/total-orders";
import React, { useEffect, useMemo, useState } from "react";
import dishStore from "stores/DishStore";
import styles from "./styles.module.css";

type Props = {
  order: GetResponse;
  breakIndex: number;
  weekDay: number;
};

const OrderCard: React.FC<Props> = React.forwardRef(({ order, breakIndex, weekDay }, ref) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const openModal = (id: number, open: boolean) => {
    dishStore.fetchDish(id);
    router.replace({ pathname: "", query: { weekDay, breakIndex, isOpen } }, undefined, {
      shallow: true,
    });
  };

  const ordersTable = order.dishes.map((dish) => {
    return (
      <tr key={dish.id} className={styles.dishRow}>
        <td width={"35%"}>{dish.name}</td>
        <td width={"15%"}>{dish._count.preferences}</td>
        <td width={"15%"}>{dish.weightGrams}</td>
        <td width={"35%"} className={styles.aboutCell}>
          <div className={styles.aboutBtn}>
            <span
            onClick={() => openModal(dish.id, true)}>...</span>
          </div>
        </td>
      </tr>
    )
  });


  if (!order) return null;
  return (
    <div className={styles.orderContainer}>
      <div className={isOpen ? styles.orderRow + ' ' + styles.openOrder : styles.orderRow}
        onClick={() => setOpen(!isOpen)}>
        <div className={styles.orderInfo}>
          <span>{`${order.number}  ${order.letter} класс`}</span>
          <span>{`${order.breakIndex + 1} переменна`}</span>
        </div>
        <img src="/img/arrow.png" 
          alt="arrow"
          width={20}
          height={20}
          className={isOpen ? styles.arrowImg : styles.arrowUp} />
      </div>
      <div className={isOpen ? styles.orderDetailsContainer : styles.orderDetailsHide}>
        <div className={styles.orderDetails}>
            <table className={styles.orderTable}>
              <tbody>
                <tr className={styles.orderTableHeads}>
                  <td width={"35%"}>Блюдо</td>
                  <td width={"15%"}>Количество</td>
                  <td width={"15%"}>гр/шт</td>
                  <td width={"35%"}>Дополнительно</td>
                </tr>
                {ordersTable}
              </tbody>
            </table>
            
        </div>
      </div>

    </div>
  );
});
OrderCard.displayName;

export default OrderCard;
