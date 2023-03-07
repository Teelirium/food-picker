import { Dish, DishType } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, FC } from 'react';

import DishCard from 'components/WorkerPage/Dishes/DishCard';
import dishTypeMap from 'utils/dishTypeMap';
import mealTimeMap from 'utils/mealTimeMap';

import styles from './styles.module.css';

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

  const dishesComponents = filteredDishes.map((dish) => <DishCard key={dish.id} dish={dish} />);

  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <div className={styles.mealTimeContainer}>
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
        </div>

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
            <div className={styles.addDishBtn}>
              <img src="/img/plus.png" alt="plus" />
              <span>Добавить блюдо</span>
            </div>
          </Link>
        </div>

        <div className={styles.dishesContainer}>{dishesComponents}</div>
      </div>
    </div>
  );
};

export default Dishes;
