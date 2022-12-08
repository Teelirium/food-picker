import { useState } from "react";
import { Dish, DishType } from "@prisma/client";
import styles from "../styles/dishes.module.css"
import AddDishModal from "pages-content/worker/components/addDishModal";

const Dishes = (props: {dishes: Dish[]}) => {
    const dishesList = props.dishes.filter((dish) => dish.type == dishType);

    const [mealTime, setMealTime] = useState("Breakfast");
    const [dishType, setDishType] = useState("PRIMARY");
    const [currentDishesList, setDishesList] = useState(dishesList);
    const [isModalOpen, setModalOpen] = useState(false);

    const selectDishType = (type: DishType) => {
        setDishType(type);

        const filteredDishesList = props.dishes.filter((dish) => dish.type == dishType);
        setDishesList(filteredDishesList);
    };
    


    return (
        <>
            <div className={styles.content}>
                <div className={styles.contentInner}>
                    <div className={styles.mealTimeContainer}>
                        <div className={styles.mealTime}>
                            <span className={ mealTime === "Breakfast" ?
                                styles.activeMealTimeElement : 
                                styles.mealTimeElement}
                                onClick={() => setMealTime("Breakfast")}>
                                Завтрак
                            </span>
                            <span className={ mealTime === "Lunch" ?
                                styles.activeMealTimeElement : 
                                styles.mealTimeElement}
                                onClick={() => setMealTime("Lunch")}>
                                Обед
                            </span>
                            <span className={ mealTime === "Dinner" ?
                                styles.activeMealTimeElement : 
                                styles.mealTimeElement}
                                onClick={() => setMealTime("Dinner")}>
                                Ужин
                            </span>
                        </div>
                        <form className={styles.search}>
                            <button type="submit" className="search-btn">
                                <img src="/img/search.png"/>
                            </button>
                            <input type="text" placeholder="Поиск"/>
                        </form>
                    </div>

                    <div className={styles.dishTypesContainer}>
                        <div className={styles.dishTypes}>
                            <div className={dishType === "PRIMARY" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => selectDishType("PRIMARY")}>
                                <span>Первое блюдо</span>
                            </div>
                            <div className={dishType === "SECONDARY" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => selectDishType("SECONDARY")}>
                                <span>Горячее</span>
                            </div>
                            <div className={dishType === "SIDE" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => selectDishType("SIDE")}>
                                <span>Гарнир</span>
                            </div>
                            <div className={dishType === "DRINK" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => selectDishType("DRINK")}>
                                <span>Напиток</span>
                            </div>
                            <div className={dishType === "EXTRA" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => selectDishType("EXTRA")}>
                                <span>Дополнительно</span>
                            </div>
                        </div>
                        <div className={styles.addDishBtn}
                            onClick={() => setModalOpen(true)}>
                            <img src="/img/plus.png" alt="plus" />
                            <span>Добавить блюдо</span>
                        </div>
                    </div>
                </div> 
                {JSON.stringify(currentDishesList)}
            </div>
                
            { isModalOpen ? <AddDishModal dishType={dishType} setModalOpen={setModalOpen}/> : null }
        </>
    )
}

export default Dishes;