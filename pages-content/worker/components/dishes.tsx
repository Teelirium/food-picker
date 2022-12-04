import { useState } from "react";
import styles from "../styles/dishes.module.css"
import AddDishModal from "pages-content/worker/components/addDishModal";

const Dishes = () => {
    const [mealTime, setMealTime] = useState("Breakfast");
    const [dishType, setDishType] = useState("PRIMARY");
    const [isModalOpen, setModalOpen] = useState(false);


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
                                onClick={() => setDishType("PRIMARY")}>
                                <span>Первое блюдо</span>
                            </div>
                            <div className={dishType === "SECONDARY" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => setDishType("SECONDARY")}>
                                <span>Горячее</span>
                            </div>
                            <div className={dishType === "SIDE" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => setDishType("SIDE")}>
                                <span>Гарнир</span>
                            </div>
                            <div className={dishType === "DRINK" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => setDishType("DRINK")}>
                                <span>Напиток</span>
                            </div>
                            <div className={dishType === "EXTRA" ?
                                styles.activeDishType :
                                styles.dishType}
                                onClick={() => setDishType("EXTRA")}>
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
            </div>

            { isModalOpen ? <AddDishModal /> : null }
        </>
    )
}

export default Dishes;