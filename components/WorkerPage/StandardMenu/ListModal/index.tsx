import { Dish, DishType } from '@prisma/client';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import ModalWrapper from 'components/ModalWrapper';
import DishCard from 'components/WorkerPage/Dishes/DishCard';

import styles from './styles.module.scss';

type Props = {
  toggle: () => void;
  toggleInfo: (id?: number) => () => void;
  day: number;
  dishType: DishType;
};

async function fetchDishes(type: DishType) {
  const resp = await axios.get(`/api/dishes?type=${type}`);
  return resp.data as Dish[];
}

const ListModal: React.FC<Props> = ({ toggle, toggleInfo, day, dishType }) => {
  const qClient = useQueryClient();

  const query = useQuery(['dishesOfType', dishType], () => fetchDishes(dishType));

  const mutation = useMutation(
    ({ dishId, day }: { dishId: number; day: number }) => {
      return axios.post(`/api/preferences/default?day=${day}`, { dishId });
    },
    {
      onSuccess: () => {
        qClient.invalidateQueries('defaults');
        toggle();
      },
    },
  );

  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        {/* TODO some popup idk */}
        {query.isLoading && 'Загрузка...'}
        {mutation.isLoading && 'Блюдо выбирается...'}
        {query.isSuccess && (
          <>
            <ul className={styles.list}>
              {query.data.map((dish) => (
                <li key={dish.id}>
                  <DishCard
                    dish={dish}
                    onClick={toggleInfo(dish.id)}
                    onButtonClick={() => mutation.mutate({ day, dishId: dish.id })}
                  />
                </li>
              ))}
            </ul>
            <button className={styles.cancel} type="button" onClick={toggle}>
              Отмена
            </button>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ListModal;
