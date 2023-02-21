import { Dish, DishType } from '@prisma/client';
import { useState, useMemo, FC } from 'react';

import DishCard from 'components/WorkerPage/Dishes/DishCard';
import dishTypeMap from 'utils/dishTypeMap';
import mealTimeMap from 'utils/mealTimeMap';

import AddDishModal from './DishModal';
import styles from './styles.module.css';

interface DishesProps {
  dishes: Dish[];
}

const Dishes: FC<DishesProps> = ({ dishes }) => {
  const [mealTime, setMealTime] = useState('Breakfast');
  const [dishType, setDishType] = useState<DishType>('PRIMARY');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    method: string;
    currentDish: Dish | undefined;
  }>({
    isOpen: false,
    method: 'POST',
    currentDish: undefined,
  });

  const filteredDishes = useMemo(
    () => dishes.filter((dish) => dish.type === dishType),
    [dishType, dishes],
  );

  const setModalOpenForPost = () => {
    setModalState({
      isOpen: !modalState.isOpen,
      method: 'POST',
      currentDish: undefined,
    });
  };

  const setModalOpenForUpdate = (dish: Dish) => {
    setModalState({
      isOpen: !modalState.isOpen,
      method: 'UPDATE',
      currentDish: dish,
    });
  };

  const dishesComponents = filteredDishes.map((dish) => (
    <DishCard key={dish.id} dish={dish} updateDish={setModalOpenForUpdate} />
  ));

  return (
    <>
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.mealTimeContainer}>
            <div className={styles.mealTime}>
              {Array.from(mealTimeMap.entries()).map((meal) => (
                <span
                  key={meal[0]}
                  className={
                    mealTime === meal[0] ? styles.activeMealTimeElement : styles.mealTimeElement
                  }
                  onClick={() => setMealTime(meal[0])}
                >
                  {meal[1]}
                </span>
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
                <div
                  key={k}
                  className={dishType === k ? styles.activeDishType : styles.dishType}
                  onClick={() => setDishType(k as DishType)}
                >
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <div className={styles.addDishBtn} onClick={() => setModalOpenForPost()}>
              <img src="/img/plus.png" alt="plus" />
              <span>Добавить блюдо</span>
            </div>
          </div>

          <div className={styles.dishesContainer}>{dishesComponents}</div>
        </div>
      </div>

      {modalState.isOpen ? (
        <AddDishModal
          dishType={dishType}
          setModalOpen={setModalOpenForPost}
          method={modalState.method}
          dish={modalState.currentDish}
        />
      ) : null}
    </>
  );
};

export default Dishes;
