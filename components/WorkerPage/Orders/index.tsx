import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { GradeInfo } from 'pages/api/grades/total-orders';
import dayMap from 'utils/dayMap';
import maxDay from 'utils/maxDay';
import OrderCard from './OrderCard';
import styles from './styles.module.css';

type Props = {
  orders: GradeInfo | undefined;
  weekDay: number;
};

const Orders: React.FC<Props> = ({ orders, weekDay }) => {
  const [breakIndex, setBreakIndex] = useState(0);
  const router = useRouter();
  const filteredOrders = useMemo(
    () => orders?.filter((order) => order.breakIndex === breakIndex),
    [breakIndex, orders],
  );

  const breakIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.weekDaysContainer}>
          <div className={styles.weekDays}>
            {dayMap.slice(0, maxDay).map((dayName, i) => (
              <Link
                key={i}
                href={{ pathname: '', query: { ...router.query, day: i } }}
                shallow
                replace
              >
                <div className={weekDay === i ? styles.activeWeekDay : styles.weekDay}>
                  {dayName}
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.excelBtn}>
            <img
              src="/img/Excel.png"
              alt="excel"
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
          {breakIndexes.map((i) => (
            <div
              key={i}
              className={breakIndex === i ? styles.activeBreak : styles.break}
              onClick={() => setBreakIndex(i)}
            >
              <span>{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
