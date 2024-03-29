import { DishType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { z } from 'zod';

import ModalWrapper from 'components/ModalWrapper';
import PreferenceSection from 'components/PreferenceSection';
import DishAboutModal from 'components/WorkerPage/DishAboutModal';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { DefaultDishes } from 'pages/api/preferences/default';
import dayMap from 'utils/dayMap';
import deleteEmptyParams from 'utils/deleteEmptyParams';
import dishTypeMap from 'utils/dishTypeMap';
import maxDay from 'utils/maxDay';
import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';
import dishTypeSchema from 'utils/schemas/dishTypeSchema';
import idSchema from 'utils/schemas/idSchema';

import ListModal from './ListModal';
import styles from './styles.module.scss';

const paramSchema = z.object({
  day: dayOfWeekSchema.default(0),
  dishType: dishTypeSchema.optional(),
  dishId: idSchema.optional(),
});

const dishTypes: DishType[] = ['PRIMARY', 'SECONDARY', 'SIDE', 'DRINK'];

async function getDishes(day: number) {
  const data = (await axios
    .get(`/api/preferences/default?day=${day}`)
    .then((res) => res.data)) as DefaultDishes;
  // console.log('fetched', day);
  return new Map(data.map((d) => [d.Dish.type, d.Dish]));
}

export default function StandardMenu() {
  const router = useRouter();

  const { day, dishType, dishId } = paramSchema.parse(router.query);

  const query = useQuery(['defaults', day], () => getDishes(day), {
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const toggleList = useCallback(
    (dishType: DishType) => () => {
      router.replace({ pathname: router.basePath, query: { day, dishType } }, undefined, {
        shallow: true,
      });
    },
    [day, router],
  );

  const toggleInfo = useCallback(
    (id?: number) => () => {
      router.replace(
        {
          pathname: router.basePath,
          query: deleteEmptyParams({ ...router.query, dishId: id }),
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const showSpinner = query.isFetching || query.isPreviousData;

  return (
    <div className={styles.container}>
      {showSpinner && (
        <ModalWrapper provideContainer>
          <LoadingSpinner />
        </ModalWrapper>
      )}
      <header className={styles.header}>
        <h1>Стандартное питание</h1>
        <h2>Стандартное питание на неделю устанавливается по умолчанию для всех учеников</h2>
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
              handleEdit={toggleList(type)}
              handleAdd={toggleList(type)}
              handleView={toggleInfo(query.data.get(type)?.id)}
            />
          ))}
      </main>
      {dishType && (
        <ListModal
          day={day}
          dishType={dishType}
          toggle={() =>
            router.replace({ pathname: router.basePath, query: { day } }, undefined, {
              shallow: true,
            })
          }
          toggleInfo={toggleInfo}
        />
      )}
      {dishId !== undefined && <DishAboutModal dishId={dishId} />}
    </div>
  );
}
