import axios from "axios";
import { useForm } from "react-hook-form";
import { DishFormData, DishType } from "types/Dish";
import styles from "../styles/addDishModal.module.css";


const AddDishModal = (props: {dishType: string, setModalOpen: Function}) => {
  const { register, handleSubmit } = useForm<DishFormData>();
  const closeModalHandler = () => {
    props.setModalOpen(false);
  }




  const onSubmit = handleSubmit(data => {
    axios.post('/api/dishes/', {dish: data})
    .then(resp => console.log("Блюдо добавлено!"))
    .catch(console.log);
  })

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.closeBtn}
          onClick={() => closeModalHandler()}>
          <img src="/img/close.png" alt="close" width={20} height={20}/>
        </div>
          <label>
            <span style={{marginRight: "15px"}}>Ссылка на изображение</span>
            <div className={styles.inputBorder}>
              <input type={"text"} className={styles.formInput} size={35} {...register("imgURL")} />
            </div>
          </label>
        <label>
          <span style={{marginRight: "15px"}}>Название блюда:</span>
          <div className={styles.inputBorder}>
            <input type={"text"} className={styles.formInput} size={48} {...register("name")} />
          </div>
        </label>
        <label>
          <span style={{marginRight: "173px"}}>Вес:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} {...register('weightGrams', {
              valueAsNumber: true})} />
          </div>
          <span> г.</span>
        </label>
          <label>
            <span style={{marginRight: "86px"}}>Стоимость:</span>
            <div className={styles.inputBorder}>
              <input type={"number"} className={styles.formInput} {...register("price", {
                valueAsNumber: true})} />
            </div>  
            <span> ₽</span>
          </label>
          <span>Энергетическая ценность</span>
          <label>
          <span  style={{marginRight: "31px"}}>(калорийность:)</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} {...register('calories', {
              valueAsNumber: true})} />
          </div> 
        </label>
          <label>
            <span style={{marginRight: "148px"}}>Белки:</span>
            <div className={styles.inputBorder}>
              <input type={"number"} className={styles.formInput} {...register('proteins', {
                valueAsNumber: true})} />
            </div>
            <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "148px"}}>Жиры:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} {...register('fats', {
              valueAsNumber: true})} />
          </div>
          <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "107px"}}>Углеводы:</span>
          <div className={styles.inputBorder}>
            <input type={"number"} className={styles.formInput} {...register('carbs', {
              valueAsNumber: true})} />
          </div>  
          <span> г.</span>
        </label>
        <label>
          <span style={{marginRight: "19px"}}>Состав:</span>
          <div className={styles.inputBorder}>
            <textarea className={styles.formInput + ' ' + styles.ingredientsInput} {...register('ingredients')} />
          </div>
        </label>
        
        <input className={styles.hiddenTypeInput} type={"text"} value={props.dishType} {...register('type')} />
        <label className={styles.formBtns}>
          <div className={styles.cancelBtn}
            onClick={() => closeModalHandler()}>Отмена</div>
          
        </label>
        <button className={styles.submitBtn}>Сохранить</button>
      </form>
    </div>
  );
};

export default AddDishModal;