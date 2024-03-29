import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { MAX_WEEKDAYS } from 'app.config';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { totalOrdersQueryOpts } from 'modules/orders/queries';
import dayMap from 'utils/dayMap';

import OrderCard from './OrderCard';
import styles from './styles.module.css';

type Props = {
  weekDay: number;
};

const breakIndexes = [0, 1, 2, 3, 4, 5, 6, 7];

const Orders: React.FC<Props> = ({ weekDay }) => {
  const router = useRouter();
  const [breakIndex, setBreakIndex] = useState(0);

  const { data: orders, ...totalOrdersQuery } = useQuery(totalOrdersQueryOpts(new Date()));

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.weekDaysContainer}>
          <div className={styles.weekDays}>
            {dayMap.slice(0, MAX_WEEKDAYS).map((dayName, i) => (
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
          {/* <div className={styles.excelBtn}>
            <img
              src="/img/Excel.png"
              alt="excel"
              width={25}
              height={25}
              className={styles.excelImg}
            />
            <span>Выгрузить в Excel</span>
          </div> */}
        </div>
        <div className={styles.ordersContainer}>
          {totalOrdersQuery.isLoading && <LoadingSpinner />}
          {totalOrdersQuery.isError && 'Что-то пошло не так'}
          {orders &&
            Object.values(orders).map(
              (order) =>
                breakIndex === order.grade?.breakIndex && (
                  <OrderCard key={order.grade?.id} order={order} weekDay={weekDay} />
                ),
            )}
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
