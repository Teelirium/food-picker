import axios from "axios";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { DishFormData, DishType } from "types/Dish";


const AddDishModal = () => {
  const { register, handleSubmit } = useForm<DishFormData>();
  const dishTypes: DishType[] = ["PRIMARY", "SIDE", "SECONDARY", "DRINK", "EXTRA"];
  const ruTypesNames = new Map([
    ["PRIMARY", "Первое"],
    ["SECONDARY", "Второе"],
    ["SIDE", "Гарнир"],
    ["DRINK", "Напиток"],
    ["EXTRA", "Дополнительное"]
  ]);

  const onSubmit = handleSubmit(data => {
    axios.post('/api/dishes/', {dish: data})
    .then(resp => console.log("Блюдо добавлено!"))
    .catch(console.log);
  })

  return (
    <div className='bg-slate-300 h-screen w-screen'>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <label>
          Название
          <input type={"text"} {...register("name")} />
        </label>
        <label>
          Ссылка на изображение
          <input type={"text"} {...register("imgURL")} />
        </label>
        <label>
          Вес в грамммах
          <input type={"number"} {...register('weightGrams', {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Состав
          <input type={"text"} {...register('ingredients')} />
        </label>
        <label>
          Цена
          <input type={"number"} {...register("price", {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Калории
          <input type={"number"} {...register('calories', {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Жиры
          <input type={"number"} {...register('fats', {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Белки
          <input type={"number"} {...register('proteins', {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Углеводы
          <input type={"number"} {...register('carbs', {
            valueAsNumber: true,
            })} />
        </label>
        <label>
          Тип блюда
          <select {...register('type')}>
            {dishTypes.map(type => (
              <option key={type} value={type}>{ruTypesNames.get(type)}</option>
            ))}
          </select>
        </label>
        <button className='bg-orange-300'>Добавить блюдо</button>
      </form>
    </div>
  );
};

export default AddDishModal;