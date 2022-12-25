import { GetResponse } from "pages/api/grades/total-orders";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  order: GetResponse;
};

const OrderCard: React.FC<Props> = React.forwardRef(({ order }, ref) => {
  const [isOpen, setOpen] = useState(false);
  const ordersTable = order.dishes.map((dish) => {
    return (
      <tr className={styles.dishRow}>
        <td width={"35%"}>{dish.name}</td>
        <td width={"15%"}>{dish._count.preferences}</td>
        <td width={"15%"}>{dish.weightGrams}</td>
        <td width={"35%"} className={styles.aboutCell}>
          <div className={styles.aboutBtn}>
            <span>...</span>
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
              <tr className={styles.orderTableHeads}>
                <td width={"35%"}>Блюдо</td>
                <td width={"15%"}>Количество</td>
                <td width={"15%"}>гр/шт</td>
                <td width={"35%"}>Дополнительно</td>
              </tr>
              {ordersTable}
            </table>
            
        </div>
      </div>
    </div>
  );
});
OrderCard.displayName;

export default OrderCard;
