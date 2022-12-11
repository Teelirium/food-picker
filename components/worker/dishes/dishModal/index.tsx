import axios from "axios";
import React, { useState } from "react";
import { Dish } from "@prisma/client";
import { useForm } from "react-hook-form";
import { DishFormData} from "types/Dish";
import styles from "./styles.module.css";

type Props = {
  dishType: string;
  setModalOpen: Function;
  method: string;
  dish: Dish | undefined
};

const AddDishModal: React.FC<Props> = ({ dishType, setModalOpen, method, dish }) => {
  const { register, handleSubmit } = useForm<DishFormData>();
  console.log(method === "POST")

  const onSubmit = () => {
    switch (method) {
      case "POST":
        handleSubmit(data => {
          axios.post('/api/dishes/', {dish: data})
          .then(resp => console.log("Блюдо добавлено!"))
          .catch(console.log);
        });
        break;
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.closeBtn}
          onClick={() => setModalOpen()}>
          <img src="/img/close.png" alt="close" width={20} height={20}/>
        </div>
          <label>
            <span style={{marginRight: "15px"}}>Ссылка на изображение</span>
            <div className={styles.inputBorder}>
              <input type={"text"} className={styles.formInput} defaultValue={dish?.imgURL} size={35} {...register("imgURL")} />
            </div>
          </label>
        <label>
          <span style={{marginRight: "15px"}}>Название блюда:</span>
          <div className={styles.inputBorder}>
            <input type={"text"} className={styles.formInput} defaultValue={dish?.name} size={48} {...register("name")} />
          </div>
        </label>
        <label>
          <span style={{marginRight: "173px"}}>Вес:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} defaultValue={dish?.weightGrams} {...register('weightGrams', {
              valueAsNumber: true})} />
          </div>
          <span> г.</span>
        </label>
          <label>
            <span style={{marginRight: "86px"}}>Стоимость:</span>
            <div className={styles.inputBorder}>
              <input type={"number"} className={styles.formInput}  defaultValue={dish?.price} {...register("price", {
                valueAsNumber: true})} />
            </div>  
            <span> ₽</span>
          </label>
          <span>Энергетическая ценность</span>
          <label>
          <span  style={{marginRight: "31px"}}>(калорийность:)</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput}  defaultValue={dish?.calories} {...register('calories', {
              valueAsNumber: true})} />
          </div> 
        </label>
          <label>
            <span style={{marginRight: "148px"}}>Белки:</span>
            <div className={styles.inputBorder}>
              <input type={"number"} className={styles.formInput}  defaultValue={dish?.proteins} {...register('proteins', {
                valueAsNumber: true})} />
            </div>
            <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "148px"}}>Жиры:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput}  defaultValue={dish?.fats} {...register('fats', {
              valueAsNumber: true})} />
          </div>
          <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "107px"}}>Углеводы:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} defaultValue={dish?.carbs} {...register('carbs', {
              valueAsNumber: true})} />
          </div>  
          <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "19px"}}>Состав:</span>
          <div className={styles.inputBorder}>
            <textarea className={styles.formInput + ' ' + styles.ingredientsInput}  defaultValue={dish?.ingredients} {...register('ingredients')} />
          </div>
        </label>
        
        <input className={styles.hiddenTypeInput} type={"text"} defaultValue={dishType} {...register('type')} />
        <label className={styles.formBtns}>
          <div className={styles.cancelBtn}
            onClick={() => setModalOpen()}>Отмена</div>
          
        </label>
        <button className={styles.submitBtn}>Сохранить</button>
      </form>
    </div>
  );
};

export default AddDishModal;