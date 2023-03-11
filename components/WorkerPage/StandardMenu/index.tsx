import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { z } from 'zod';

import PreferenceSection from 'components/PreferenceSection';
import { DefaultDishes } from 'pages/api/preferences/default';
import { DishType } from 'types/Dish';
import dayMap from 'utils/dayMap';
import dishTypeMap from 'utils/dishTypeMap';
import maxDay from 'utils/maxDay';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';

import ListModal from './ListModal';
import styles from './styles.module.scss';

const paramSchema = z.object({
  day: dayOfWeekSchema.default(0),
  dishType: dishTypeSchema.optional(),
});

const dishTypes: DishType[] = ['PRIMARY', 'SECONDARY', 'SIDE', 'DRINK'];

async function getDishes(day: number) {
  const data = (await axios
    .get(`/api/preferences/default?day=${day}`)
    .then((res) => res.data)) as DefaultDishes;
  // console.log('fetched', day);
  return new Map(data.map((d) => [d.Dish.type, d.Dish]));
}

const StandardMenu: React.FC = () => {
  const router = useRouter();

  const { day, dishType } = paramSchema.parse(router.query);

  const query = useQuery(['defaults', day], () => getDishes(day), { keepPreviousData: true });

  const toggleModal = useCallback(
    (dishType: DishType) => () => {
      router.replace({ pathname: router.basePath, query: { day, dishType } }, undefined, {
        shallow: true,
      });
    },
    [day, router],
  );

  return (
    <div className={styles.container}>
      {(query.isLoading || query.isPreviousData) && (
        <div className={styles.spinner}>
          <span>Загрузка...</span>
        </div>
      )}
      <header className={styles.header}>
        <ul>
          {dayMap.slice(0, maxDay).map((d, i) => (
            <Link key={d} href={{ pathname: router.basePath, query: { day: i } }} shallow>
              <li aria-current={day === i}>{d}</li>
            </Link>
          ))}
        </ul>
        {/* <span>Видеоинструкция</span> */}
      </header>
      <main className={styles.body}>
        {query.isSuccess &&
          dishTypes.map((type) => (
            <PreferenceSection
              key={type}
              title={dishTypeMap[type]}
              dish={query.data.get(type)}
              handleEdit={toggleModal(type)}
              handleAdd={toggleModal(type)}
            />
          ))}
      </main>
      <footer className={styles.footer}>(Меню повторяется каждую неделю)</footer>
      {dishType && (
        <ListModal
          day={day}
          dishType={dishType}
          toggle={() =>
            router.replace({ pathname: router.basePath, query: { day } }, undefined, {
              shallow: true,
            })
          }
        />
      )}
    </div>
  );
};

export default StandardMenu;