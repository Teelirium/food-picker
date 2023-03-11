import { Dish, DishType } from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

import ModalWrapper from 'components/ModalWrapper';

import styles from './styles.module.scss';

type Props = {
  toggle: () => void;
  day: number;
  dishType: DishType;
};

async function fetchDishes(type: DishType) {
  const resp = await axios.get(`/api/dishes?type=${type}`);
  return resp.data as Dish[];
}

const ListModal: React.FC<Props> = ({ toggle, day, dishType }) => {
  const query = useQuery(['dishesOfType', dishType], () => fetchDishes(dishType));
  return (
    <ModalWrapper toggle={toggle}>
      <div className={styles.container}>
        {query.isLoading && 'Загрузка...'}
        {query.isSuccess && (
          <>
            <div>
              {query.data.map((dish) => (
                <div key={dish.id}>{dish.name}</div>
              ))}
            </div>
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
