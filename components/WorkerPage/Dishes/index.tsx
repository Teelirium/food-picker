import { Dish, DishType } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import ThinButton from 'components/ThinButton';
import DishCard from 'components/WorkerPage/Dishes/DishCard';
import { PlusIcon } from 'components/ui/Icons';
import dishTypeMap from 'utils/dishTypeMap';
import mealTimeMap from 'utils/mealTimeMap';

import styles from './styles.module.scss';

type Props = {
  dishes: Dish[];
  mealTime: string;
  dishType: DishType;
};

const Dishes: FC<Props> = ({ dishes, mealTime, dishType }) => {
  const router = useRouter();

  const filteredDishes = useMemo(
    () => dishes.filter((dish) => dish.type === dishType),
    [dishType, dishes],
  );

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        {/* <div className={styles.mealTimeContainer}>
          <div className={styles.mealTime}>
            {Array.from(mealTimeMap.entries()).map((meal) => (
              <Link
                key={meal[0]}
                href={{ pathname: '', query: { ...router.query, mealTime: meal[0] } }}
                shallow
                replace
              >
                <span
                  className={
                    mealTime === meal[0] ? styles.activeMealTimeElement : styles.mealTimeElement
                  }
                >
                  {meal[1]}
                </span>
              </Link>
            ))}
          </div>
          <form className={styles.search}>
            <button type="submit" className="search-btn">
              <img src="/img/search.png" alt="search" />
            </button>
            <input type="text" placeholder="Поиск" />
          </form>
        </div> */}
        <div className={styles.dishTypesContainer}>
          <div className={styles.dishTypes}>
            {Object.entries(dishTypeMap).map(([k, v]) => (
              <Link
                key={k}
                href={{ pathname: '', query: { ...router.query, dishType: k } }}
                shallow
                replace
              >
                <div className={dishType === k ? styles.activeDishType : styles.dishType}>
                  <span>{v}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href={{ pathname: '', query: { ...router.query, modalMethod: 'POST' } }}
            shallow
            replace
          >
            <ThinButton>
              <PlusIcon />
              <span>Добавить блюдо</span>
            </ThinButton>
          </Link>
        </div>

        <main className={styles.dishesContainer}>
          <div className={styles.dishList}>
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onClick={() =>
                  router.replace(
                    {
                      pathname: '',
                      query: { ...router.query, modalMethod: 'GET', dishId: dish.id },
                    },
                    undefined,
                    { shallow: true },
                  )
                }
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dishes;
