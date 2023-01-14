import { GradeInfo } from "pages/api/grades/total-orders";
import React, { useMemo, useState } from "react";
import styles from "./styles.module.css";
import OrderCard from "./OrderCard";
import dayMap from "utils/dayMap";
import maxDay from "utils/maxDay";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  orders: GradeInfo | undefined;
  weekDay: number;
};

const Orders: React.FC<Props> = (props) => {
  const [breakIndex, setBreakIndex] = useState(0);
  const router = useRouter();
  const filteredOrders = useMemo(() => {
    return props.orders?.filter((order) => order.breakIndex == breakIndex);
  }, [breakIndex, props.orders]);

  const breakIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.weekDaysContainer}>
          <div className={styles.weekDays}>
            {dayMap.slice(0, maxDay).map((dayName, i) => (
              <Link
                key={i}
                href={{ pathname: "", query: { ...router.query, day: i } }}
                shallow={true}
                replace={true}
              >
                <div
                  className={
                    props.weekDay === i ? styles.activeWeekDay : styles.weekDay
                  }
                >
                  {dayName}
                </div>
              </Link>
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
        <div className={styles.ordersContainer}>
          {filteredOrders?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
      <div className={styles.breakContainer}>
        <span>Перемена</span>
        <div className={styles.breaks}>
          {breakIndexes.map((i) => {
            return (
              <div
                key={i}
                className={breakIndex === i ? styles.activeBreak : styles.break}
                onClick={() => setBreakIndex(i)}
              >
                <span>{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
