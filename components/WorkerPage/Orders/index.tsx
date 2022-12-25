import { GetResponse } from "pages/api/grades/total-orders";
import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";
import OrderCard from "./OrderCard";
import dayMap from "utils/dayMap";
import maxDay from "utils/maxDay";

type Props = {
  orders: GetResponse[] | undefined;
  weekDay: number;
  setWeekDay: Function;
};

const Orders: React.FC<Props> = (props) => {
  const [breakIndex, setBreakIndex] = useState(1);

  const filteredOrders = useMemo(() => {
    return props.orders?.filter((order) => order.breakIndex == breakIndex - 1);
  }, [breakIndex, props.orders]);

  const currentOrders = filteredOrders?.map((order) => {
    return <OrderCard key={order.id}
      order={order}
      breakIndex={breakIndex}
      weekDay={props.weekDay}
      />;
  });

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.weekDaysContainer}>
          <div className={styles.weekDays}>
            {dayMap.slice(0, maxDay).map((dayName, i) => (
              <div
                key={i}
                className={
                  props.weekDay === i ? styles.activeWeekDay : styles.weekDay
                }
                onClick={() => props.setWeekDay(i)}
              >
                <span>{dayName}</span>
              </div>
            ))}
          </div>
          <div className={styles.excelBtn}>
            <img
              src={"/img/Excel.png"}
              alt='excel'
              width={25}
              height={25}
              className={styles.excelImg}
            />
            <span>Выгрузить в Excel</span>
          </div>
        </div>
        <div className={styles.ordersContainer}>{currentOrders}</div>
      </div>
      <div className={styles.breakContainer}>
        <span>Перемена</span>
        <div className={styles.breaks}>
          <div
            className={breakIndex === 1 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(1)}
          >
            <span>1</span>
          </div>
          <div
            className={breakIndex === 2 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(2)}
          >
            <span>2</span>
          </div>
          <div
            className={breakIndex === 3 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(3)}
          >
            <span>3</span>
          </div>
          <div
            className={breakIndex === 4 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(4)}
          >
            <span>4</span>
          </div>
          <div
            className={breakIndex === 5 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(5)}
          >
            <span>5</span>
          </div>
          <div
            className={breakIndex === 6 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(6)}
          >
            <span>6</span>
          </div>
          <div
            className={breakIndex === 7 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(7)}
          >
            <span>7</span>
          </div>
          <div
            className={breakIndex === 8 ? styles.activeBreak : styles.break}
            onClick={() => setBreakIndex(8)}
          >
            <span>8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
