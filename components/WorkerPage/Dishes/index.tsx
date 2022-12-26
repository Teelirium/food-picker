import { useState, useMemo } from "react";
import { Dish, DishType } from "@prisma/client";
import styles from "./styles.module.css";
import AddDishModal from "./DishModal";
import DishCard from "components/WorkerPage/Dishes/DishCard";
import dishTypeMap from "utils/dishTypeMap";
import mealTimeMap from "utils/mealTimeMap";

const Dishes = (props: { dishes: Dish[] }) => {
  const [mealTime, setMealTime] = useState('Breakfast');
  const [dishType, setDishType] = useState<DishType>('PRIMARY');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    method: string;
    currentDish: Dish | undefined;
  }> ({
    isOpen: false,
    method: "POST",
    currentDish: undefined,
  });

  const dishes = useMemo(() => {
    return props.dishes.filter((dish) => dish.type == dishType);
  }, [dishType, props.dishes]);

  const setModalOpenForPost = () => {
    setModalState({
      isOpen: !modalState.isOpen,
      method: "POST",
      currentDish: undefined,
    });
  };

  const setModalOpenForUpdate = (dish: Dish) => {
    setModalState({
      isOpen: !modalState.isOpen,
      method: "UPDATE",
      currentDish: dish,
    });
  };

  const dishesComponents = dishes.map((dish) => {
    return (
      <DishCard key={dish.id} dish={dish} updateDish={setModalOpenForUpdate} />
    );
  });

  return (
    <>
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.mealTimeContainer}>
            <div className={styles.mealTime}>
              {Array.from(mealTimeMap.entries()).map((meal) => {
                return (<span
                  key={meal[0]}
                  className={
                    mealTime === meal[0]
                      ? styles.activeMealTimeElement
                      : styles.mealTimeElement
                  }
                  onClick={() => setMealTime(meal[0])}
                  >
                  {meal[1]}
                  </span>
              )})}
            </div>
            <form className={styles.search}>
              <button type='submit' className='search-btn'>
                <img src='/img/search.png' alt="search"/>
              </button>
              <input type='text' placeholder='Поиск' />
            </form>
          </div>

          <div className={styles.dishTypesContainer}>
            <div className={styles.dishTypes}>
            { Object.entries(dishTypeMap).map(([k, v]) => {
              return (
                <div
                className={
                  dishType == k
                    ? styles.activeDishType
                    : styles.dishType
                }
                onClick={() => setDishType(k as DishType)}
                >
                  <span>{v}</span>
                </div>
              );
            })}
            </div>
            <div
              className={styles.addDishBtn}
              onClick={() => setModalOpenForPost()}
            >
              <img src='/img/plus.png' alt='plus' />
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
